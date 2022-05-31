import React from 'react'
import type { NextPage } from 'next'
import { createPost } from '@lib/mutations'
import { useForm } from 'react-hook-form'
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import type { Post } from '@prisma/client'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { H2 } from '@components-common'
import { useRouter } from 'next/router'

export const PostCreateContainer: NextPage = () => {
  const router = useRouter()

  const formOptions = {
    resolver: yupResolver(
      Yup.object().shape({
        title: Yup.string().required('Title is required').min(4).max(255),
        plot: Yup.string().required('Plot is required').min(6).max(500),
      }),
    ),
  }
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<{ plot: Post['plot']; title: Post['title'] }>(formOptions)

  const onSubmit = handleSubmit(async data => {
    const { post, error, message } = await createPost({
      plot: data.plot,
      title: data.title,
    })
    if (post && isSubmitSuccessful) {
      router.push(`/posts/${post.post_uuid}`)
    }
    if (error) {
      setError('title', { message: message })
    }
  })

  const handleCancel = () => {
    router.back()
  }
  return (
    <VStack w={'full'} flexGrow={1} p={8}>
      <Container>
        <H2 textAlign="left">Create New Post</H2>
        <Container>
          <form onSubmit={onSubmit} name="create">
            <VStack w="full" align="flex-start" spacing={4}>
              <FormControl isInvalid={errors.title as boolean | undefined}>
                <FormLabel>Title:</FormLabel>
                <Input id="title" placeholder="Title" {...register('title')} />
                <FormErrorMessage>
                  {errors.title && errors.title.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.plot as boolean | undefined}>
                <FormLabel>Plot:</FormLabel>
                <Textarea
                  id="plot"
                  placeholder="Plot"
                  height="200px"
                  {...register('plot')}
                />
                <FormErrorMessage>
                  {errors.plot && errors.plot.message}
                </FormErrorMessage>
              </FormControl>
              <HStack w="full" justify="space-between">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button
                  variant="solid"
                  colorScheme="blue"
                  type="submit"
                  isLoading={isSubmitting}
                  alignSelf="flex-end"
                >
                  Create Post
                </Button>
              </HStack>
            </VStack>
          </form>
        </Container>
      </Container>
    </VStack>
  )
}
