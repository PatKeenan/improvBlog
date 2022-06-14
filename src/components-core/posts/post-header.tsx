import { IoMdCheckmark, IoMdClose, IoMdTrash } from 'react-icons/io';
import { postPlotTitleSchema } from '@lib/formValidations';
import { H1, H5, SmallText } from '@components-common';
import { yupResolver } from '@hookform/resolvers/yup';
import type { PostIncludingAuthor } from '@models';
import { postMutations } from '@lib/mutations';
import type { Post } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { VscEdit } from 'react-icons/vsc';
import { useSWRConfig } from 'swr';
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

export const PostHeader = ({
  post,
  editable,
  handleDelete,
}: {
  post: PostIncludingAuthor;
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
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(postPlotTitleSchema) });

  const { mutate } = useSWRConfig();

  const onSubmit = handleSubmit(async data => {
    if (post) {
      const { updatedPost, error: serverErrorsEdit } =
        await postMutations().edit(post.post_uuid, data);

      if (serverErrorsEdit && serverErrorsEdit.hasOwnProperty('inner')) {
        serverErrorsEdit.inner.forEach(
          (er: { path: string; message: string }) => {
            setError(er.path, { message: er.message });
          },
        );
      }
      if (updatedPost) {
        const { plot, title, isPrivate } = updatedPost;
        mutate(`/posts/${post.post_uuid}`, {
          ...post,
          plot,
          title,
          private: isPrivate,
        });
        handleClose();
      }
    }
  });

  const handleCancel = () => {
    reset();
    handleClose();
  };

  ///////////////////////////////
  return (
    <form onSubmit={onSubmit} style={{ width: '100%' }}>
      <VStack
        w="full"
        spacing={4}
        marginInlineStart="auto"
        marginInlineEnd="auto"
      >
        <FormControl isInvalid={errors.title}>
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
        <FormControl isInvalid={errors.plot}>
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
              isLoading={isSubmitting}
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
