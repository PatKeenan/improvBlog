import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  VStack,
} from '@chakra-ui/react'
import { usePost } from '@lib-client/usePost'
import { PostHeader } from '@components-core/posts'
import { Determine } from '@components-feat'
import type { Block, Post } from '@prisma/client'
import { useRouter } from 'next/router'
import { toCapitalCase } from '@utils'
import Head from 'next/head'
import React from 'react'
import { BlockCard } from './block-card'
import { Paragraph, SmallText } from '@components-common'
import { useBlocks } from '@lib-client/useBlock'
import { BsLock, BsUnlock } from 'react-icons/bs'

export const PostDetailContainer = () => {
  const [selectedBlock, setSelectedBlock] = React.useState<null | Block['id']>(
    null,
  )
  const router = useRouter()
  const { post_uuid } = router.query as unknown as {
    post_uuid: Post['post_uuid']
  }
  const { post, loading, error } = usePost(post_uuid)

  const handleSelectBlock = (block: number) => {
    setSelectedBlock(block)
  }

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
                    <Button
                      h="auto"
                      w="full"
                      px="4"
                      pb="4"
                      pt="6"
                      fontWeight="normal"
                      bg="gray.50"
                      position="relative"
                      role="group"
                      wordBreak="break-word"
                      whiteSpace="normal"
                      onClick={() => handleSelectBlock(block.id)}
                      border={
                        block.id === selectedBlock
                          ? '1px solid indigo'
                          : '1px solid transparent'
                      }
                    >
                      <BlockCard
                        key={block.block_uuid}
                        contributionTotal={Number(block._count.contributions)}
                        content={block.contributions[0].content}
                        createdAt={block.contributions[0].createdAt}
                        username={block.contributions[0].author.username}
                        likes={block.contributions[0].likes}
                      />
                    </Button>
                  </HStack>
                ))}
              </VStack>
            </GridItem>
            <GridItem colSpan={4}>
              <VStack flexGrow={1} shadow="base" h="full">
                {selectedBlock ? (
                  <ContributionList blockId={selectedBlock} />
                ) : (
                  <Paragraph>Select a block</Paragraph>
                )}
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </>
    ) : null,
  })
}

const ContributionList = ({ blockId }: { blockId: Block['id'] }) => {
  const { data, loading, error } = useBlocks(blockId)
  return Determine({
    error,
    loading,
    component: data ? (
      <>
        {data.contributions.map(i => (
          <VStack
            w="full"
            px="4"
            pb="4"
            pt="6"
            fontWeight="normal"
            bg="gray.50"
            position="relative"
            role="group"
            wordBreak="break-word"
            whiteSpace="normal"
            align="flex-start"
            key={i.contribution_uuid}
          >
            <Paragraph>{i.content}</Paragraph>
            <SmallText>{i.author.username}</SmallText>
          </VStack>
        ))}
      </>
    ) : null,
  })
}
