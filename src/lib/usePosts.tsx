/**
 *
 * All of the posts handler logic is located in - src/server//routers/posts.router.ts
 *
 */
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Post } from '@prisma/client';
import { trpc } from './trpc';

export const usePosts = () => {
  const toast = useToast();
  const router = useRouter();
  const utils = trpc.useContext();

  return {
    // GET POSTS
    getPosts: () =>
      trpc.useInfiniteQuery(['posts.all', { limit: 6 }], {
        keepPreviousData: true,
        getNextPageParam: lastPage => lastPage.nextCursor,
      }),
    // GET POST
    getPost: (post_uuid: Post['post_uuid']) =>
      trpc.useQuery(['posts.single', { post_uuid }]),

    // CREATE POST
    createPost: (options: { onSuccesFunc: () => void }) =>
      trpc.useMutation(['posts.create'], {
        onSuccess: data => {
          options.onSuccesFunc();
          router.push(`/posts/${data?.post_uuid}`);
        },
        onError: error => {
          toast({
            position: 'top',
            status: 'error',
            description: error.message,
            isClosable: true,
          });
        },
      }),

    // UPDATE POST with a custom callback from the UI.
    updatePost: (options: { onSuccesFunc?: () => void }) =>
      trpc.useMutation(['posts.update'], {
        onSuccess: data => {
          utils
            .invalidateQueries(['posts.single', { post_uuid: data.post_uuid }])
            .then(() => {
              if (options.onSuccesFunc) {
                return options.onSuccesFunc();
              }
            });
        },
        onError: error => {
          toast({
            position: 'top',
            status: 'error',
            description: error.message,
            isClosable: true,
          });
        },
      }),

    // DELETE POST
    deletePost: () =>
      trpc.useMutation(['posts.deleteById'], {
        onSuccess: () => {
          router.push('/posts');
        },
      }),
  };
};
