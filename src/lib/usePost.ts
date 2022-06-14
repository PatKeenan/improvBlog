import { Block, Contribution, Post, User } from '@prisma/client';
import fetcher from './fetcher';
import useSWR from 'swr';

interface UserType extends Contribution {
  author: Pick<User, 'name'>;
}

interface BlockType extends Block {
  contributions: UserType[];
  _count: {
    contributions: Number;
  };
}
export interface UsePostTypes extends Post {
  author: User;
  blocks: BlockType[];
}


// The api will send back {error: true, message: "Post not found"} if user navigates to a post detail page which does not exist on a dynamic route
const hasData = <T>(data: T ): T | undefined => {
  if(!data){
    return undefined
  }
  if(typeof data === "object" && 'error' in data){
    return undefined;
  }
  return data
};

export const usePost = (post_uuid: Post["post_uuid"]) => {
  const { data, error, mutate } = useSWR<UsePostTypes>(
    post_uuid ? `/posts/${post_uuid}` : null,
    fetcher,
  );

  return {
    post: hasData(data),
    loading: !data && !error,
    error: error,
    mutate,
  };
};
