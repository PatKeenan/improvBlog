import { useContributionStore } from '@lib/useContributionStore';
import { Determine, ResourceNotFound, Paragraph } from '@components';
import { BlockCard } from '@components/comps-posts/block-card';
import { BsLock, BsUnlock } from 'react-icons/bs';
import type { Block, Post } from '@prisma/client';
import { blockMutations } from '@lib/mutations';
import { useSession } from 'next-auth/react';
import { chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { toCapitalCase } from '@utils';
import type { NextPage } from 'next';
import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  ContributionList,
  PostHeader,
  ContributionModal,
} from '@components/comps-posts';
import { usePosts } from '@lib/usePosts';
import Head from 'next/head';

export const PostDetailContainer: NextPage = () => {
  const [noResourceMessage] = useState('Post Not Found'); // Sets the message after a post get's deleted.

  const [selectedBlock, setSelectedBlock] = useState<null | Block['id']>(null);
  const [blockLoading, setBlockLoading] = useState(false);

  const { toggleModalClosed } = useContributionStore();

  const router = useRouter();
  const { post_uuid } = router.query as unknown as {
    post_uuid: Post['post_uuid'];
  };

  const { data: session } = useSession();

  const { getPost, deletePost } = usePosts();

  const { data, isError, isLoading } = getPost(post_uuid);
  const { mutate } = deletePost();

  const handleDelete = () => {
    mutate({ post_uuid });
  };

  const handleAddBlock = async () => {
    setBlockLoading(true);
    if (data) {
      const { newBlock } = await blockMutations().create({
        postId: data?.id,
      });
      if (newBlock) {
        /*  mutateConfig(`/posts/${post_uuid}`); */
      }
    }
    setBlockLoading(false);
  };

  ////////////////////////////////

  return Determine({
    error: isError,
    loading: isLoading,
    component: data ? (
      <>
        <Head>
          <title>{toCapitalCase(data.title)}</title>
          <meta name="description" content={data.plot} />
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
            post={data}
            handleDelete={handleDelete}
            editable={data.authorId === session?.user.id ?? false}
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
              hasPost={data ? true : false}
              post_id={data.id}
              post_uuid={data.post_uuid}
            />
            {data.blocks.length > 0 && (
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
                    {data.blocks.map(block => {
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
                    {session?.user.id == data.authorId ? (
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
                        post_uuid={data.post_uuid}
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

export default PostDetailContainer;
