import { H1, H2, H5, SmallText } from '@components-common'
import {
  Avatar,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  EditableTextarea,
  FormControl,
  FormErrorMessage,
  HStack,
  IconButton,
  Textarea,
  useEditableControls,
  VStack,
} from '@chakra-ui/react'
import type { Post, User } from '@prisma/client'
import moment from 'moment'
import { useForm, Controller } from 'react-hook-form'
import { IoMdCheckmark, IoMdClose } from 'react-icons/io'
import React, { BaseSyntheticEvent } from 'react'
import { BiEdit } from 'react-icons/bi'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

export const PostHeader = ({
  title,
  plot,
  createdAt,
  username,
  editable,
}: {
  title: Post['title']
  plot: Post['plot']
  createdAt: Post['createdAt']
  username: User['username']
  editable: boolean
}) => {
  const [isEditing, setIsEditing] = React.useState(false)
  return (
    <VStack align="flex-start" spacing={6} w="full">
      {isEditing && editable ? (
        <EditHeader
          title={title}
          plot={plot}
          handleCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <H1>{title}</H1>
          <H5 fontStyle="italic">{plot}</H5>
        </>
      )}
      <HStack>
        <Avatar size="xs" />
        <SmallText>
          Created By:{' '}
          {`${editable ? 'you' : username} ${moment(createdAt).fromNow()}`}
        </SmallText>
        {editable && !isEditing ? (
          <IconButton
            aria-label="Edit Post"
            icon={<BiEdit />}
            onClick={() => setIsEditing(true)}
          />
        ) : null}
      </HStack>
    </VStack>
  )
}
const EditHeader = ({
  title,
  plot,
  handleCancel,
}: {
  title: string
  plot: string
  handleCancel: () => void
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        title: Yup.string().required().min(4).max(255),
        plot: Yup.string().required('Plot is required').min(6).max(500),
      }),
    ),
  })
  const onCancel = () => {
    reset()
    handleCancel()
  }
  const onSubmit = handleSubmit(async data => {
    console.log(data)
  })
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
              onClick={onCancel}
            />
            <IconButton
              aria-label="Submit Edit"
              type="submit"
              icon={<IoMdCheckmark />}
            />
          </ButtonGroup>
        </HStack>
      </VStack>
    </form>
  )
}
