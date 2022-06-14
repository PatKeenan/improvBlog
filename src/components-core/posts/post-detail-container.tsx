import { useContributionStore } from '@lib/useContributionStore';
import { blockMutations, postMutations } from '@lib/mutations';
import { Determine, ResourceNotFound } from '@components-feat';
import { BsLock, BsUnlock } from 'react-icons/bs';
import type { Block, Post } from '@prisma/client';
import { Paragraph } from '@components-common';
import { BlockCard } from './block-card';
import { chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { toCapitalCase } from '@utils';
import { usePost } from '@lib/usePost';
import type { NextPage } from 'next';
import { useMe } from '@lib/useMe';
import {
  ContributionList,
  PostHeader,
  ContributionModal,
} from '@components-core/posts';
import Head from 'next/head';

import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { useSWRConfig } from 'swr';

export const PostDetailContainer: NextPage = () => {
  const [selectedBlock, setSelectedBlock] = React.useState<null | Block['id']>(
    null,
  );
  const [noResourceMessage, setNoResourceMessage] =
    React.useState('Post Not Found');

  const [blockLoading, setBlockLoading] = React.useState(false);
  const { mutate: mutateConfig } = useSWRConfig();

  const router = useRouter();
  const { post_uuid } = router.query as unknown as {
    post_uuid: Post['post_uuid'];
  };

  const { user } = useMe();
  const { post, loading, error, mutate } = usePost(post_uuid);
  const { toggleModalClosed } = useContributionStore();

  const handleDelete = async () => {
    if (post) {
      await postMutations()
        .remove(post.post_uuid)
        .then(() => {
          setNoResourceMessage('Successfully delete post');
          mutate(undefined);
        });
    }
  };

  const handleAddBlock = async () => {
    setBlockLoading(true);
    if (post) {
      const { newBlock } = await blockMutations().create({
        postId: post?.id,
      });
      if (newBlock) {
        mutateConfig(`/posts/${post_uuid}`);
      }
    }
    setBlockLoading(false);
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
                              username={block.contributions[0].author.name}
                              likes={block.contributions[0].likes}
                            />
                          </HStack>
                        );
                      } else {
                        // If there are no contributions, show the empty card
                        return (
                          <HStack
                            alignItems="center"
                            key={block.block_uuid}
                            width="full"
                          >
                            {block.frozen ? (
                              <Icon as={BsLock} />
                            ) : (
                              <Icon as={BsUnlock} />
                            )}
                            <Box
                              as="button"
                              bg="gray.50"
                              _hover={{ bg: 'gray.200' }}
                              _active={{ bg: 'gray.200' }}
                              w="full"
                              rounded="md"
                              h={'83.59px'}
                              border={
                                selectedBlock === block.id
                                  ? '1px solid indigo'
                                  : '1px solid transparent'
                              }
                              onClick={() => setSelectedBlock(block.id)}
                            >
                              <Paragraph>Crickets...</Paragraph>
                            </Box>
                          </HStack>
                        );
                      }
                    })}
                    {user?.id == post.authorId ? (
                      <Button
                        onClick={handleAddBlock}
                        w="full"
                        h="40px"
                        variant="outline"
                        isLoading={blockLoading}
                      >
                        Add Block
                      </Button>
                    ) : null}
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
                      <ContributionList
                        blockId={selectedBlock}
                        user={user}
                        post_uuid={post.post_uuid}
                      />
                    ) : (
                      <Paragraph m="auto 0">Select a block</Paragraph>
                    )}
                  </VStack>
                </GridItem>
              </>
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
