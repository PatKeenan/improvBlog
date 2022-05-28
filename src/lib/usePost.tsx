import { Block, Contribution, Post, User } from '@prisma/client'
import fetcher from './fetcher'
import useSWR from 'swr'

interface UserType extends Contribution {
  author: Pick<User, 'username'>
}

interface BlockType extends Block {
  contributions: UserType[]
  _count: {
    contributions: Number
  }
}
interface UsePostTypes extends Post {
  author: User
  blocks: BlockType[]
}

export const usePost = (post_uuid: string) => {
  const { data, error } = useSWR<UsePostTypes>(
    post_uuid ? `/posts/${post_uuid}` : null,
    fetcher,
  )

  return {
    post: data,
    loading: !data && !error,
    error: error,
  }
}
