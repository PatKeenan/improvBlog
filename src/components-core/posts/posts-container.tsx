import {usePosts} from '@lib-client/usePosts'
import {VStack} from '@chakra-ui/react'
import type {NextPage} from 'next'
import moment from 'moment'
import {
  CardContent,
  CardFooter,
  CardTitle,
  SmallText,
  Card,
} from '@components-common'

export const PostsContainer: NextPage = () => {
  const {posts, loading, error} = usePosts()
  return (
    <VStack spacing={4} width="full">
      {posts && !loading ? (
        posts.map(i => {
          return (
            <Card key={i.post_uuid} link={i.post_uuid}>
              <CardTitle>{i.title}</CardTitle>
              <CardContent>{i.plot}</CardContent>
              <CardFooter>
                <SmallText>Author: {i.author.username}</SmallText>
                <SmallText>
                  Last Updated: {moment(i.updatedAt).fromNow()}
                </SmallText>
              </CardFooter>
            </Card>
          )
        })
      ) : (
        <p>Loading...</p>
      )}
    </VStack>
  )
}
