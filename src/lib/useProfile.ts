import {Post, Profile, User} from '@prisma/client'
import fetcher from './fetcher'
import useSWR from 'swr'

/* interface Posts extends Post {
  _count: {blocks: number; contributions: number}
}
interface UsePostTypes extends Posts {
  author: User
} */

export const useProfile = (id: string) => {
  const {data, error} = useSWR<Profile>(`/profile/${id}`, fetcher)
  return {
    profile: data,
    loading: !data && !error,
    error: error,
  }
}
