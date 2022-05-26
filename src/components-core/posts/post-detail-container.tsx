import { Box, Grid, GridItem, HStack, VStack } from '@chakra-ui/react'
import { usePost } from '@lib-client/usePost'
import { PostHeader } from '@components-core/posts'
import { Determine } from '@components-feat'
import type { Post } from '@prisma/client'
import { useRouter } from 'next/router'
import { toCapitalCase } from '@utils'
import Head from 'next/head'
import React from 'react'
import { BlockCard } from './block-card'
import { Paragraph, SmallText } from '@components-common'

export const PostDetailContainer = () => {
  const router = useRouter()
  const { post_uuid } = router.query as unknown as {
    post_uuid: Post['post_uuid']
  }
  const { post, loading, error } = usePost(post_uuid)

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
          <Box h="fit-content">
            <PostHeader
              title={post.title}
              plot={post.plot}
              createdAt={post.createdAt}
              username={post.author.username}
            />
          </Box>
          <Grid
            templateColumns="repeat(10,1fr)"
            w="full"
            gap={8}
            flexGrow={1}
            overflow="scroll"
          >
            <GridItem colSpan={6}>
              <VStack align={'flex-start'} spacing="6" w="full" m="0 auto">
                {post.blocks.map(block => (
                  <BlockCard
                    key={block.block_uuid}
                    contributionTotal={Number(block._count.contributions)}
                    content={block.contributions[0].content}
                    createdAt={block.contributions[0].createdAt}
                    username={block.contributions[0].author.username}
                    showFrozen={true}
                    frozen={block.frozen}
                    likes={block.contributions[0].likes}
                  />
                ))}
              </VStack>
            </GridItem>
            <GridItem colSpan={4}>
              <VStack flexGrow={1} shadow="base" h="full">
                <Paragraph>Select a block</Paragraph>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </>
    ) : null,
  })
}

const ContributionList = (blockId: number) => {
  return <p>hello</p>
}
