import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { Determine, ResourceNotFound } from '@components-feat';
import { H3, Paragraph } from '@components-common';
import type { Block, Post } from '@prisma/client';
import { BsLock, BsUnlock } from 'react-icons/bs';
import { postMutations } from '@lib/mutations';
import { EditablePostFields } from '@models';
import { useRouter } from 'next/router';
import { toCapitalCase } from '@utils';
import { usePost } from '@lib/usePost';
import type { NextPage } from 'next';
import { useMe } from '@lib/useMe';
import {
  ContributionList,
  ContributionCard,
  PostHeader,
} from '@components-core/posts';
import Head from 'next/head';
import React, { useRef } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { BlockCard } from './block-card';

export const PostDetailContainer: NextPage = () => {
  const [selectedBlock, setSelectedBlock] = React.useState<null | Block['id']>(
    null,
  );
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
      await postMutations().remove({ postId: post.id });
      mutate(undefined);
      router.push('/posts');
    }
  };
  const blockRef = useRef();

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
          <Box h="fit-content" w="full">
            <PostHeader
              post={post}
              handleEditPost={handleEditPost}
              handleDelete={handleDelete}
              editable={post.authorId === user?.id ?? false}
            />
          </Box>
          <Grid
            templateColumns="repeat(10,1fr)"
            w="full"
            p={2}
            gap={8}
            flexGrow={1}
            overflow="scroll"
          >
            {post.blocks.length > 0 ? (
              <>
                <GridItem colSpan={6}>
                  <VStack align={'flex-start'} spacing="6" w="full" m="0 auto">
                    {post.blocks.map(block => {
                      return block.contributions.length > 0 ? (
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
                            username={block.contributions[0].author.username}
                            likes={block.contributions[0].likes}
                          />
                        </HStack>
                      ) : (
                        <Box>
                          <p>yo</p>
                        </Box>
                      );
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
            ) : (
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
        message="Post Not Found"
        href={'/posts'}
        title="Go Back to Posts?"
      />
    ),
  });
};

const AddContribution = () => {
  return (
    <Box
      border="1px dashed"
      borderWidth={3}
      borderColor="gray.200"
      w="full"
      p={8}
      rounded="md"
      justifyContent="center"
      display="flex"
    >
      <Button leftIcon={<IoMdAdd />} variant="outline" justifySelf="center">
        Create the First Contribution
      </Button>
    </Box>
  );
};
