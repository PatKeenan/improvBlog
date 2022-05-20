import {ErrorBoundary} from '@components-feat/ErrorBoundary'
import {usePosts} from '@lib-client/usePosts'
import {Box} from '@chakra-ui/react'
import type {NextPage} from 'next'

export const HomeContainer: NextPage = () => {
  const {posts, loading, error} = usePosts()

  return (
    <div>
      {posts && !loading ? (
        posts.map(i => (
          <Box key={i.post_uuid} bg="gray.500" borderRadius={'2xl'} p="2">
            <p>{i.title}</p>
            <p>{i.plot}</p>
            <p>{i.author.username}</p>

            <p>Current Contributions: {i._count.contributions}</p>
          </Box>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
