import type { Contribution, User, Block } from '@prisma/client'
import { Paragraph, SmallText } from '@components-common'
import {
  AvatarBadge,
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  VStack,
} from '@chakra-ui/react'
import { BsLock, BsUnlock } from 'react-icons/bs'
import { AiOutlineHeart } from 'react-icons/ai'
import moment from 'moment'
import React from 'react'

export const BlockCard = ({
  content,
  createdAt,
  username,
  likes,
  contributionTotal,
}: {
  content: Contribution['content']
  createdAt: Contribution['createdAt']
  username: User['username']
  contributionTotal: number
  likes: Contribution['likes']
}) => {
  return (
    <>
      <Box
        position="absolute"
        bottom="-2"
        right="-1"
        rounded="full"
        bg="gray.200"
        border="4px solid white"
        h="25px"
        w="25px"
        d="flex"
        alignItems="center"
      >
        <SmallText textAlign={'center'} w="full">
          {contributionTotal}
        </SmallText>
      </Box>
      <VStack
        display="flex"
        flexDir="column"
        w="full"
        alignItems={'flex-start'}
      >
        <Paragraph textAlign="left">{content}</Paragraph>
        <HStack
          align="center"
          justify="space-between"
          w="full"
          spacing="4"
          opacity="0"
          _groupHover={{ opacity: 1 }}
        >
          <SmallText fontWeight="light">
            Contributed by {username} {moment(createdAt).fromNow()}
          </SmallText>
          <SmallText>{likes} Likes</SmallText>
        </HStack>
      </VStack>
    </>
  )
}