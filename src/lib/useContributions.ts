import {Contribution, User} from '@prisma/client'
import fetcher from './fetcher'
import useSWR from 'swr'


interface ContributionsType extends Contribution {
    author: User
}
export const useContributions = (blockId: number) => {
  const {data, error} = useSWR<ContributionsType[]>(`/contributions/by-block/${blockId}`, fetcher)
  return {
    contributions: data,
    loading: !data && !error,
    error: error,
  }
}
