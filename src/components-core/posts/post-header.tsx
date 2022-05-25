import { H1, H5, SmallText } from '@components-common'
import { Avatar, HStack, VStack } from '@chakra-ui/react'
import type { Post, User } from '@prisma/client'
import moment from 'moment'

export const PostHeader = ({
  title,
  plot,
  createdAt,
  username,
}: {
  title: Post['title']
  plot: Post['plot']
  createdAt: Post['createdAt']
  username: User['username']
}) => (
  <VStack align="flex-start" spacing={6}>
    <H1 textTransform="capitalize">{title}</H1>
    <H5 fontStyle="italic">{plot}</H5>
    <HStack>
      <Avatar size="xs" />
      <SmallText>
        Created By: {`${username} ${moment(createdAt).fromNow()}`}
      </SmallText>
    </HStack>
  </VStack>
)
