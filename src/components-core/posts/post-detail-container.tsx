import {ContributionCard, H1, H5, SmallText} from '@components-common'
import {Box, Grid, GridItem, HStack, VStack} from '@chakra-ui/react'
import {Determine} from '@components-feat/Determine'
import {toCapitalCase} from 'utils/toCapitalCase'
import {usePost} from '@lib-client/usePost'
import {useRouter} from 'next/router'
import Head from 'next/head'
import moment from 'moment'
import React from 'react'

export const PostDetailContainer = () => {
  const router = useRouter()
  const {id: post_uuid} = router.query as unknown as {id: string}
  const {post, loading, error} = usePost(post_uuid)

  return Determine({
    error,
    loading,
    component: post ? (
      <>
        <Head>
          <title>{toCapitalCase(post?.title ?? '') ?? 'Improv'}</title>
          <meta
            name="description"
            content={post?.plot ?? 'Community based stories'}
          />
        </Head>

        <Grid templateColumns="repeat(8,1fr)" width="full" p={10} gap={2}>
          <GridItem colSpan={8}>
            <VStack align="flex-start" mb="4">
              <H1 textTransform="capitalize">{post.title}</H1>
              <H5>{post.plot}</H5>
              <HStack>
                <SmallText>
                  Created By:{' '}
                  {`${post.author.username} ${moment(
                    post.createdAt,
                  ).fromNow()}`}
                </SmallText>
              </HStack>
            </VStack>
          </GridItem>
          <GridItem colSpan={5}>
            <VStack align={'flex-start'} spacing="6">
              {post.blocks.map(block => (
                <VStack
                  key={block.block_uuid}
                  width="80%"
                  m="0 auto"
                  align="flex-start"
                >
                  <ContributionCard
                    content={block.contributions[0].content}
                    createdAt={block.contributions[0].createdAt}
                    username={block.contributions[0].author.username}
                    showFrozen={true}
                    frozen={block.frozen}
                    likes={block.contributions[0].likes}
                  />
                  <Box
                    width="full"
                    minH="20"
                    border="1px dashed"
                    borderRadius="10px"
                  />
                </VStack>
              ))}
            </VStack>
          </GridItem>
          <GridItem colSpan={3}>Revisions</GridItem>
        </Grid>
      </>
    ) : null,
  })
}
