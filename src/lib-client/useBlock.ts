import {Block, Contribution, User} from '@prisma/client'
import fetcher from './fetcher'
import useSWR from 'swr'

interface ContributionType extends Contribution {
    author: User
}
interface BlockType extends Block {
  contributions: ContributionType[]
}
export const useBlocks = (blockId?: number) => {
  const {data, error} = useSWR<BlockType>(blockId ? `/blocks/${blockId}` : null, fetcher)
  return {
    data: data,
    loading: !data && !error,
    error: error,
  }
}
