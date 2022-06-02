import type { EditablePostFields, PostIncludingAuthor } from '@models';
import { postPlotTitleSchema } from '@lib/formValidations';
import { IoMdCheckmark, IoMdClose, IoMdTrash } from 'react-icons/io';
import { H1, H5, SmallText } from '@components-common';
import { yupResolver } from '@hookform/resolvers/yup';
import type { Post } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { BiEdit } from 'react-icons/bi';
import Link from 'next/link';
import moment from 'moment';
import React from 'react';
import {
  Avatar,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  HStack,
  IconButton,
  Textarea,
  VStack,
  Link as ChakraLink,
} from '@chakra-ui/react';

export const PostHeader = ({
  post,
  editable,
  handleEditPost,
  handleDelete,
}: {
  post: PostIncludingAuthor;
  handleEditPost: (body: EditablePostFields) => void;
  editable: boolean;
  handleDelete: () => void;
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <VStack align="flex-start" spacing={6} w="full" maxW="container.lg">
      {isEditing && editable ? (
        <HeaderEditForm
          handleEditPost={handleEditPost}
          handleClose={() => setIsEditing(false)}
          title={post.title}
          plot={post.plot}
        />
      ) : (
        <>
          <H1>{post.title}</H1>
          <H5 fontStyle="italic">{post.plot}</H5>
        </>
      )}
      <HStack>
        <Avatar size="xs" />
        <SmallText>
          Created By:{' '}
          <Link href={`/users/${post.authorId}`} passHref>
            <ChakraLink color="cyan.700" fontWeight="semibold">
              {`${editable ? 'you' : post.author.username}`}
            </ChakraLink>
          </Link>{' '}
          {moment(post.createdAt).fromNow()}
        </SmallText>
        {editable && !isEditing ? (
          <IconButton
            aria-label="Edit Post"
            icon={<BiEdit />}
            onClick={() => setIsEditing(true)}
          />
        ) : null}
        {editable ? (
          <IconButton
            aria-label="Delete Post"
            icon={<IoMdTrash />}
            onClick={handleDelete}
          />
        ) : null}
      </HStack>
    </VStack>
  );
};

const HeaderEditForm = ({
  handleEditPost,
  handleClose,
  title,
  plot,
}: {
  handleEditPost: (body: EditablePostFields) => void;
  handleClose: () => void;
  title: Post['title'];
  plot: Post['plot'];
}) => {
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(postPlotTitleSchema),
  });

  const onSubmit = handleSubmit(async data => {
    setLoading(true);
    Promise.resolve(handleEditPost(data)).then(() => {
      setLoading(false);
      handleClose();
    });
  });

  const handleCancel = () => {
    reset();
    handleClose();
  };

  ///////////////////////////////
  return (
    <form onSubmit={onSubmit} style={{ width: '100%' }}>
      <VStack w="full" spacing={4}>
        <FormControl isInvalid={errors.title}>
          <Textarea
            defaultValue={title}
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
          <Textarea defaultValue={plot} {...register('plot')} />
          <FormErrorMessage>
            {errors.plot && errors.plot.message}
          </FormErrorMessage>
        </FormControl>
        <HStack>
          <ButtonGroup>
            <IconButton
              aria-label="Cancel Edit"
              icon={<IoMdClose />}
              onClick={handleCancel}
            />
            <IconButton
              aria-label="Submit Edit"
              type="submit"
              isLoading={loading}
              icon={<IoMdCheckmark />}
            />
          </ButtonGroup>
        </HStack>
      </VStack>
    </form>
  );
};
