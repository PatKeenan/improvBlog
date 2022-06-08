import { postMutations } from '@lib/mutations';
import { Determine, ResourceNotFound } from '@components-feat';
import { chakra } from '@chakra-ui/react';
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
import { useContributionStore } from '@lib/useContributionStore';

export const PostDetailContainer: NextPage = () => {
  const [selectedBlock, setSelectedBlock] = React.useState<null | Block['id']>(
    null,
  );
  const [noResourceMessage, setNoResourceMessage] =
    React.useState('Post Not Found');

  const router = useRouter();
  const { post_uuid } = router.query as unknown as {
    post_uuid: Post['post_uuid'];
  };

  const { user } = useMe();
  const { post, loading, error, mutate } = usePost(post_uuid);
  const { toggleModalOpen, toggleModalClosed } = useContributionStore();

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
        <chakra.div
          width="full"
          display="flex"
          flexDirection="column"
          p={10}
          overflow="hidden"
          minH="calc(100vh - 75px)"
          maxH="calc(100vh - 75px)"
          marginInlineStart="auto"
          marginInlineEnd="auto"
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
            height="100%"
            overflow="hidden"
            flex="auto"
            p={2}
            gap={8}
          >
            <ContributionModal
              onClose={toggleModalClosed}
              hasPost={post ? true : false}
              post_id={post.id}
              post_uuid={post.post_uuid}
              block_id={selectedBlock ?? post.blocks[0].id}
            />
            {post.blocks.length > 0 && (
              <>
                <GridItem colSpan={6} overflow="hidden">
                  <VStack
                    height="100%"
                    align="flex-start"
                    spacing="6"
                    overflow="auto"
                    flex="auto"
                    p={2}
                    className="yooo"
                  >
                    {post.blocks.map(block => {
                      // All posts start out with an empty block on creation
                      // If there are contributions, do not show the "Be the first to contribute" Card
                      if (block.contributions.length > 0) {
                        return (
                          <HStack
                            w="full"
                            key={block.block_uuid}
                            alignItems="center"
                          >
                            {block.frozen ? (
                              <Icon as={BsLock} />
                            ) : (
                              <Icon as={BsUnlock} />
                            )}
                            <BlockCard
                              key={block.block_uuid}
                              activeBorder={selectedBlock == block.id}
                              handleClick={() => setSelectedBlock(block.id)}
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
                            handleClick={toggleModalOpen}
                          />
                        );
                      }
                    })}
                  </VStack>
                </GridItem>
                <GridItem colSpan={4} overflow="auto" p={2}>
                  <VStack
                    flexGrow={1}
                    borderLeft="1px"
                    borderColor="gray.100"
                    h="100%"
                    pl={4}
                    position="relative"
                  >
                    {selectedBlock ? (
                      <ContributionList blockId={selectedBlock} />
                    ) : (
                      <Paragraph m="auto 0">Select a block</Paragraph>
                    )}
                  </VStack>
                </GridItem>
              </>
            )}
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
        </chakra.div>
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
