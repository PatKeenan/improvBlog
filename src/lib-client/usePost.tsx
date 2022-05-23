import {Post, User} from '@prisma/client'
import fetcher from './fetcher'
import useSWR from 'swr'

interface PostType extends Post {
  _count: {blocks: number; contributions: number}
}
interface UsePostTypes extends PostType {
  author: User
}

export const usePost = (post_uuid: string) => {
  const {data, error} = useSWR<UsePostTypes>(`/posts/${post_uuid}`, url =>
    fetcher(url, post_uuid),
  )
  return {
    post: data,
    loading: !data && !error,
    error: error,
  }
}
