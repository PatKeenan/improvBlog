import {Profile} from '@prisma/client'
import fetcher from './fetcher'
import useSWR from 'swr'


export const useUsers = (id: string) => {
  const {data, error} = useSWR<Profile>(`/users/${id}`, fetcher)
  return {
    profile: data,
    loading: !data && !error,
    error: error,
  }
}
