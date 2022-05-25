import type {Contribution, User, Block} from '@prisma/client'
import {Paragraph, SmallText} from '@components-common'
import {Box, HStack, IconButton, VStack} from '@chakra-ui/react'
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
      px="4"
      pt="4"
      pb="2"
      align="flex-start"
    >
      <Paragraph>{content}</Paragraph>
      <HStack align="center" justify="space-between" w="full">
        <SmallText>
          Contributed by {username} {moment(createdAt).fromNow()}
        </SmallText>
        <HStack>
          <SmallText>{likes} Likes</SmallText>
          <IconButton
            variant="ghost"
            aria-label="Like Contribution"
            icon={<AiOutlineHeart />}
          />
          {showFrozen && <Box>{frozen ? <BsLock /> : <BsUnlock />}</Box>}
        </HStack>
      </HStack>
    </VStack>
  )
}
