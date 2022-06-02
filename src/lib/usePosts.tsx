import { Post, User } from '@prisma/client';
import fetcher from './fetcher';
import useSWR from 'swr';

interface Posts extends Post {
  _count: { blocks: number; contributions: number };
}
interface UsePostTypes extends Posts {
  author: User;
}

export const usePosts = () => {
  const { data, error } = useSWR<UsePostTypes[]>('/posts', fetcher);
  return {
    posts: data,
    loading: !data && !error,
    error: error,
  };
};
