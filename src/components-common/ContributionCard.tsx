import type {Contribution, User, Block} from '@prisma/client'
import {Box, HStack, VStack} from '@chakra-ui/react'
import {Paragraph, SmallText} from './Typography'
import {BsLock, BsUnlock} from 'react-icons/bs'
import {AiOutlineHeart} from 'react-icons/ai'
import moment from 'moment'
import React from 'react'

export const ContributionCard = ({
  content,
  createdAt,
  username,
  likes,
  showFrozen = false,
  frozen = false,
}: {
  content: Contribution['content']
  createdAt: Contribution['createdAt']
  username: User['username']
  likes: Contribution['likes']
  showFrozen?: boolean
  frozen?: Block['frozen'] | null
}) => {
  return (
    <VStack
      w="full"
      bg="gray.50"
      borderRadius="10px"
      py="4"
      px="4"
      align="flex-start"
    >
      <Paragraph textTransform="capitalize">{content}</Paragraph>
      <HStack align="flex-start" justify="space-between" w="full">
        <SmallText>
          Contributed by {username}
          {moment(createdAt).fromNow()}
        </SmallText>
        <HStack>
          <SmallText>{likes} likes</SmallText>
          <AiOutlineHeart />
          {showFrozen && <Box>{frozen ? <BsLock /> : <BsUnlock />}</Box>}
        </HStack>
      </HStack>
    </VStack>
  )
}
