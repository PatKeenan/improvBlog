import { postPlotTitleSchema } from '@lib/formValidations';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoMdCheckmark } from 'react-icons/io';
import { postMutations } from '@lib/mutations';
import { useForm } from 'react-hook-form';
import { H2 } from '@components-common';
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

export const PostCreateContainer: NextPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(postPlotTitleSchema),
  });

  const onSubmit = handleSubmit(async data => {
    const {
      post,
      error: serverErrors,
      message,
    } = await postMutations().create({
      plot: data.plot,
      title: data.title,
    });

    if (post) {
      setTimeout(() => {
        router.push(`/posts/${post.post_uuid}`);
      }, 1000);
    }
    // validation form the server
    if (serverErrors && serverErrors.hasOwnProperty('inner')) {
      serverErrors.inner.forEach((er: { path: string; message: string }) => {
        setError(er.path, { message: er.message });
      });
    }
    // If returned after validation with error, it's because it failed the unique title check
    if (serverErrors && !serverErrors.hasOwnProperty('inner')) {
      setError('title', { message });
    }
  });

  const handleCancel = () => {
    router.back();
  };

  ////////////////////////////////
  return (
    <VStack w={'full'} flexGrow={1} p={8}>
      <H2 textAlign="center">Create New Post</H2>
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
                height="150px"
                resize={'none'}
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
                colorScheme={isSubmitSuccessful ? 'green' : 'blue'}
                type="submit"
                isLoading={isSubmitting}
                alignSelf="flex-end"
                rightIcon={isSubmitSuccessful ? <IoMdCheckmark /> : undefined}
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
