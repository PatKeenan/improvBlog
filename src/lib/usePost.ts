import { useToast } from "@chakra-ui/react";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import { trpc } from "./trpc";

export const usePost = () => {
  const toast = useToast()
  const router = useRouter()
 return {
    getPost: (post_uuid: Post["post_uuid"]) => trpc.useQuery(['posts.byId', {post_uuid}]),
    deletePost: () => {},
    createPost: (options: {onSuccesFunc: () => void }) =>  trpc.useMutation(['posts.create'], {
      onSuccess: data => {
        options.onSuccesFunc()
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
    })
  };
};
