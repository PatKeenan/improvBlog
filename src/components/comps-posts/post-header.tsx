import { IoMdCheckmark, IoMdClose, IoMdTrash } from 'react-icons/io';
import type { PostPlotTitleSchema } from '@lib/formValidations';
import { postPlotTitleSchema } from '@lib/formValidations';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Post, User } from '@prisma/client';
import { H1, H5, SmallText } from '@components';
import { VscEdit } from 'react-icons/vsc';
import { usePosts } from '@lib/usePosts';
import Link from 'next/link';
import moment from 'moment';
import React from 'react';
import {
  Avatar,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  HStack,
  Textarea,
  VStack,
  Link as ChakraLink,
  Button,
} from '@chakra-ui/react';

interface PostReturnedByTrpcQuery extends Post {
  author: { name: User['name'] };
}

export const PostHeader = ({
  post,
  editable,
  handleDelete,
}: {
  post: PostReturnedByTrpcQuery;
  // eslint-disable-next-line no-unused-vars
  editable: boolean;
  handleDelete: () => void;
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <VStack align="flex-start" spacing={6} w="full" h="fit-content">
      {isEditing && editable ? (
        <HeaderEditForm handleClose={() => setIsEditing(false)} post={post} />
      ) : (
        <>
          <H1>{post.title}</H1>
          <H5 fontStyle="italic">{post.plot}</H5>
        </>
      )}
      <HStack hidden={isEditing}>
        <Avatar size="xs" />
        <SmallText>
          Created By:{' '}
          <Link href={`/users/${post.authorId}`} passHref>
            <ChakraLink color="cyan.700" fontWeight="semibold">
              {`${editable ? 'you' : post.author.name}`}
            </ChakraLink>
          </Link>{' '}
          {moment(post.createdAt).fromNow()}
        </SmallText>
        {editable && !isEditing ? (
          <Button
            id="edit-button"
            size="sm"
            leftIcon={<VscEdit />}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        ) : null}
        {editable ? (
          <Button
            id="delete-button"
            size="sm"
            leftIcon={<IoMdTrash />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        ) : null}
      </HStack>
    </VStack>
  );
};

const HeaderEditForm = ({
  handleClose,
  post,
}: {
  handleClose: () => void;
  post: Post;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostPlotTitleSchema>({
    resolver: zodResolver(postPlotTitleSchema),
  });

  /*  const { mutate } = useSWRConfig(); */

  const { mutate, isLoading } = usePosts().updatePost({
    onSuccesFunc: handleClose,
  });

  const onSubmit: SubmitHandler<PostPlotTitleSchema> = async data => {
    mutate({
      title: data.title,
      plot: data.plot,
      post_uuid: post.post_uuid,
    });
  };
  const handleCancel = () => {
    reset();
    handleClose();
  };

  ///////////////////////////////
  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
      <VStack
        w="full"
        spacing={4}
        marginInlineStart="auto"
        marginInlineEnd="auto"
      >
        <FormControl isInvalid={errors.title as boolean | undefined}>
          <Textarea
            defaultValue={post.title}
            {...register('title')}
            fontWeight="bold"
            fontSize="4xl"
            letterSpacing="wider"
          />
          <FormErrorMessage>
            {errors.title && errors.title.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.plot as boolean | undefined}>
          <Textarea defaultValue={post.plot} {...register('plot')} />
          <FormErrorMessage>
            {errors.plot && errors.plot.message}
          </FormErrorMessage>
        </FormControl>
        <HStack w="full">
          <ButtonGroup>
            <Button
              id="cancel-button"
              aria-label="Cancel Edit"
              leftIcon={<IoMdClose />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              id="submit-button"
              aria-label="Submit Edit"
              type="submit"
              colorScheme="telegram"
              isLoading={isLoading}
              leftIcon={<IoMdCheckmark />}
            >
              Save
            </Button>
          </ButtonGroup>
        </HStack>
      </VStack>
    </form>
  );
};
