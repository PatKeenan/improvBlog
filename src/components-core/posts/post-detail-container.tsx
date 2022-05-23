import React from 'react'
import {useRouter} from 'next/router'
import {usePost} from '@lib-client/usePost'
import {Text} from '@chakra-ui/react'

export const PostDetailContainer = () => {
  const router = useRouter()
  const {id: post_uuid} = router.query as unknown as {id: string}
  const {post, loading, error} = usePost(post_uuid)
  return (
    <div>
      {post && !loading ? (
        <Text size="xl">{post && post.title}</Text>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
