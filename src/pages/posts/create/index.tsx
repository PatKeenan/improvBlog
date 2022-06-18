import { postPlotTitleSchema } from '@lib/formValidations';
import { yupResolver } from '@hookform/resolvers/yup';
import type { SubmitHandler } from 'react-hook-form';
import { PostByIDInput } from 'server/routers/posts.router';
import { IoMdCheckmark } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { H2 } from '@components';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
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
} from '@chakra-ui/react';
import React from 'react';
import { usePost } from '@lib/usePost';

export const PostCreate: NextPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostByIDInput>({ resolver: yupResolver(postPlotTitleSchema) });

  const { createPost } = usePost();

  const { mutate, isLoading, isSuccess } = createPost({ onSuccesFunc: reset });
  const onSubmit: SubmitHandler<PostByIDInput> = async data => {
    mutate({
      title: data.title,
      plot: data.plot,
    });
  };

  const handleCancel = () => {
    router.back();
  };

  ////////////////////////////////////////////////////////////////
  return (
    <VStack w={'full'} flexGrow={1} p={8}>
      <H2 textAlign="center">Create New Post</H2>
      <Container>
        <form onSubmit={handleSubmit(onSubmit)} name="create">
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
                height="150px"
                resize={'none'}
                {...register('plot')}
              />
              <FormErrorMessage>
                {errors.plot && errors.plot.message}
              </FormErrorMessage>
            </FormControl>
            <HStack w="full" justify="space-between">
              <Button onClick={handleCancel} id="cancel-button">
                Cancel
              </Button>
              <Button
                variant="solid"
                colorScheme={isSuccess ? 'green' : 'blue'}
                type="submit"
                id="submit-button"
                isLoading={isLoading}
                alignSelf="flex-end"
                rightIcon={isSuccess ? <IoMdCheckmark /> : undefined}
              >
                Create Post
              </Button>
            </HStack>
          </VStack>
        </form>
      </Container>
    </VStack>
  );
};

export default PostCreate;
