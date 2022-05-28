import { Determine } from '@components-feat'
import { usePosts } from '@lib/usePosts'
import { VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import moment from 'moment'
import {
  CardContent,
  CardFooter,
  CardTitle,
  SmallText,
  Card,
} from '@components-common'

export const PostsContainer: NextPage = () => {
  const { posts, loading, error } = usePosts()
  return Determine({
    error,
    loading,
    component: posts ? (
      <VStack spacing={4} width="full">
        {posts.map(i => {
          return (
            <Card key={i.post_uuid} link={i.post_uuid}>
              <CardTitle>{i.title}</CardTitle>
              <CardContent>{i.plot}</CardContent>
              <CardFooter>
                <SmallText>Creator: {i.author.username}</SmallText>
                <SmallText>Created: {moment(i.createdAt).fromNow()}</SmallText>
              </CardFooter>
            </Card>
          )
        })}
      </VStack>
    ) : null,
  })
}
