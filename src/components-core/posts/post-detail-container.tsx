import { postMutations } from '@lib/mutations';
import { Determine, ResourceNotFound } from '@components-feat';
import { H3, Paragraph } from '@components-common';
import { BsLock, BsUnlock } from 'react-icons/bs';
import type { Block, Post } from '@prisma/client';
import { EditablePostFields } from '@models';
import { BlockCard } from './block-card';
import { useRouter } from 'next/router';
import { toCapitalCase } from '@utils';
import { usePost } from '@lib/usePost';
import type { NextPage } from 'next';
import { useMe } from '@lib/useMe';
import Head from 'next/head';
import {
  ContributionList,
  PostHeader,
  ContributionModal,
  ContributeButton,
} from '@components-core/posts';
import React from 'react';
import { Grid, GridItem, HStack, Icon, VStack } from '@chakra-ui/react';

export const PostDetailContainer: NextPage = () => {
  const [selectedBlock, setSelectedBlock] = React.useState<null | Block['id']>(
    null,
  );
  const [modalOpen, setModelOpen] = React.useState(false);
  const [noResourceMessage, setNoResourceMessage] =
    React.useState('Post Not Found');

  const router = useRouter();
  const { post_uuid } = router.query as unknown as {
    post_uuid: Post['post_uuid'];
  };

  const { user } = useMe();
  const { post, loading, error, mutate } = usePost(post_uuid);

  const handleEditPost = async (body: EditablePostFields) => {
    if (post) {
      const { updatedPost, loading } = await postMutations().edit(
        post.id,
        body,
      );
      if (updatedPost && !loading) {
        const { plot, title, private: isPrivate } = updatedPost;
        mutate({
          ...post,
          plot,
          title,
          private: isPrivate,
        });
      }
    }
  };

  const handleDelete = async () => {
    if (post) {
      await postMutations()
        .remove({ postId: post.id })
        .then(() => {
          setNoResourceMessage('Successfully delete post');
          mutate(undefined);
        });
    }
  };

  ////////////////////////////////

  return Determine({
    error,
    loading,
    component: post ? (
      <>
        <Head>
          <title>{toCapitalCase(post.title)}</title>
          <meta name="description" content={post.plot} />
        </Head>
        <VStack
          width="full"
          h="full"
          flexGrow={1}
          p={10}
          gap={8}
          align="flex-start"
        >
          <PostHeader
            post={post}
            handleEditPost={handleEditPost}
            handleDelete={handleDelete}
            editable={post.authorId === user?.id ?? false}
          />

          <Grid
            templateColumns="repeat(10,1fr)"
            w="full"
            p={2}
            gap={8}
            flexGrow={1}
            overflow="scroll"
          >
            <ContributionModal
              onClose={() => setModelOpen(false)}
              hasPost={post ? true : false}
              post_id={post.id}
              post_uuid={post.post_uuid}
              block_id={selectedBlock ?? post.blocks[0].id}
              isOpen={modalOpen}
            />
            {post.blocks.length > 0 && (
              <>
                <GridItem colSpan={6}>
                  <VStack align={'flex-start'} spacing="6" w="full" m="0 auto">
                    {post.blocks.map(block => {
                      // All posts start out with an empty block on creation
                      // If there are contributions, do not show the "Be the first to contribute" Card
                      if (block.contributions.length > 0) {
                        return (
                          <HStack w="full" key={block.block_uuid}>
                            {block.frozen ? (
                              <Icon as={BsLock} />
                            ) : (
                              <Icon as={BsUnlock} />
                            )}
                            <BlockCard
                              key={block.block_uuid}
                              activeBorder={selectedBlock == block.id}
                              handleClick={() => setSelectedBlock(block.id)}
                              handleClickAway={() => setSelectedBlock(null)}
                              contributionTotal={Number(
                                block._count.contributions,
                              )}
                              content={block.contributions[0].content}
                              createdAt={block.contributions[0].createdAt}
                              username={
                                user &&
                                user.username ===
                                  block.contributions[0].author.username
                                  ? user.username
                                  : block.contributions[0].author.username
                              }
                              likes={block.contributions[0].likes}
                            />
                          </HStack>
                        );
                      } else {
                        // If there are no contributions, show the "Be the first to contribute" Card
                        return (
                          <ContributeButton
                            message="Add the First Contribution"
                            handleClick={() => setModelOpen(true)}
                          />
                        );
                      }
                    })}
                  </VStack>
                </GridItem>
                <GridItem colSpan={4}>
                  <VStack
                    flexGrow={1}
                    borderLeft="1px"
                    borderColor="gray.100"
                    h="full"
                    pl={4}
                  >
                    {selectedBlock ? (
                      <ContributionList blockId={selectedBlock} />
                    ) : (
                      <Paragraph m="auto 0">Select a block</Paragraph>
                    )}
                  </VStack>
                </GridItem>
              </>
            )}{' '}
            {post.blocks.length === 0 && (
              <GridItem colSpan={10} placeItems="center">
                <VStack
                  h="full"
                  w="full"
                  display="flex"
                  justifyContent="center"
                >
                  <H3 textAlign="center" mt={-40}>
                    No Blocks Yet
                  </H3>
                </VStack>
              </GridItem>
            )}
          </Grid>
        </VStack>
      </>
    ) : (
      <ResourceNotFound
        message={noResourceMessage}
        href={'/posts'}
        title="Go Back to Posts?"
      />
    ),
  });
};
