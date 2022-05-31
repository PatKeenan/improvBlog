import { ContributionList } from './contribution-list'
import { ContributionCard } from './contribution-card'
import type { Block, Post } from '@prisma/client'
import { BsLock, BsUnlock } from 'react-icons/bs'
import { Paragraph } from '@components-common'
import { Determine } from '@components-feat'
import { useRouter } from 'next/router'
import { toCapitalCase } from '@utils'
import { usePost } from '@lib/usePost'
import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

import { Box, Grid, GridItem, HStack, Icon, VStack } from '@chakra-ui/react'

import { PostHeader } from './post-header'
import { useMe } from '@lib/useMe'

export const PostDetailContainer: NextPage = () => {
  const [selectedBlock, setSelectedBlock] = React.useState<null | Block['id']>(
    null,
  )
  const router = useRouter()

  const { post_uuid } = router.query as unknown as {
    post_uuid: Post['post_uuid']
  }
  const { post, loading, error } = usePost(post_uuid)
  const { user } = useMe()

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
              title={post.title}
              plot={post.plot}
              createdAt={post.createdAt}
              username={post.author.username}
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
            <GridItem colSpan={6}>
              <VStack align={'flex-start'} spacing="6" w="full" m="0 auto">
                {post.blocks.map(block => (
                  <HStack w="full">
                    {block.frozen ? (
                      <Icon as={BsLock} />
                    ) : (
                      <Icon as={BsUnlock} />
                    )}

                    <ContributionCard
                      key={block.block_uuid}
                      activeBorder={selectedBlock == block.id}
                      asBlockCard={true}
                      handleClick={() => setSelectedBlock(block.id)}
                      contributionTotal={Number(block._count.contributions)}
                      content={block.contributions[0].content}
                      createdAt={block.contributions[0].createdAt}
                      username={block.contributions[0].author.username}
                      likes={block.contributions[0].likes}
                    />
                  </HStack>
                ))}
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
          </Grid>
        </VStack>
      </>
    ) : null,
  })
}
