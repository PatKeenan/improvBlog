import { useToast } from '@chakra-ui/react'
import { trpc } from './trpc'

export const useContributions = (post_uuid: string) => {
  const toast = useToast()
  const utils = trpc.useContext()
  return {
      // GET CONTRIBUTIONS
      getAllByBlock: (blockId: number) => trpc.useInfiniteQuery(['contributions.byBlock', {blockId, limit: 2}], {
        keepPreviousData: true,
        getNextPageParam: lastPage => lastPage.nextCursor
      }),
      // CREATE CONTRIBUTION
      createContrib: (options: { onSuccesFunc: () => void }) => trpc.useMutation(['contributions.create'], {
        onSuccess: () => {
          utils.invalidateQueries(['contributions.byBlock']).then(() => 
            utils.invalidateQueries(['posts.single', {post_uuid}])
          ).then(() =>  options.onSuccesFunc())
        },
        onError: error => {
          toast({
            position: 'top',
            status: 'error',
            description: error.message,
            isClosable: true,
          })
        }
    }),
      // UPDATE CONTRIBUTION
      updateContrib: (options : { onSuccessFunc: () => void}) => trpc.useMutation(['contributions.update'], {
        onSuccess: data => {
          utils.invalidateQueries(['contributions.byBlock', {blockId: data.blockId}]).then(()=>{
            utils.invalidateQueries(['posts.single', {post_uuid}])
          }).then(() => options.onSuccessFunc())
        },
       onError: error => {
          toast({
            position: 'top',
            status: 'error',
            description: error.message,
            isClosable: true,
          })
        }
      }),
      // DELETE CONTRIBUTION
      deleteContrib: () => trpc.useMutation(['contributions.delete'], {
        onSuccess: data => {
          utils.invalidateQueries(['contributions.byBlock', {blockId: data.blockId}]).then(()=>{
            utils.invalidateQueries(['posts.single', {post_uuid}])
          })
        },
        onError: error => {
          toast({
            position: 'top',
            status: 'error',
            description: error.message,
            isClosable: true,
          })
        }
      }),
     likeContrib: () => trpc.useMutation(['contributions.like'], {
      onSuccess: data => {
        utils.invalidateQueries(['contributions.byBlock', {blockId: data.blockId}]).then(()=>{
          utils.invalidateQueries(['posts.single', {post_uuid}])
        })
      },
      onError: error => {
        toast({
          position: 'top',
          status: 'error',
          description: error.message,
          isClosable: true,
        })
      }
     }),
     unlike: () => trpc.useMutation(['contributions.unlike'], {
      onSuccess: data => {
        utils.invalidateQueries(['contributions.byBlock', {blockId: data.blockId}]).then(()=>{
          utils.invalidateQueries(['posts.single', {post_uuid}])
        })
      },
      onError: error => {
        toast({
          position: 'top',
          status: 'error',
          description: error.message,
          isClosable: true,
        })
      }
     })
  }
} 
