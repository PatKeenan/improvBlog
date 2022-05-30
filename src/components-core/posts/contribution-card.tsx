import type { Contribution, User } from '@prisma/client'
import { Paragraph, SmallText } from '@components-common'
import { Box, Button, HStack, VStack } from '@chakra-ui/react'
import moment from 'moment'
import React from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { useMe } from '@lib/useMe'

export const ContributionCard = ({
  content,
  createdAt,
  username,
  contributionTotal,
  likes,
  asBlockCard = false,
  activeBorder,
  handleClick,
}: {
  content: Contribution['content']
  createdAt: Contribution['createdAt']
  username: User['username']
  likes: Contribution['likes']
  contributionTotal?: number
  asBlockCard?: boolean
  activeBorder: boolean
  handleClick?: () => void
}) => {
  const { user, loading } = useMe()

  const [liked, setLiked] = React.useState(false)
  const handleLike = () => {
    user ? setLiked(!liked) : null
  }
  return (
    <Button
      as={asBlockCard ? 'button' : 'div'}
      h="auto"
      w="full"
      px="4"
      pb="4"
      pt="6"
      _hover={{ bg: asBlockCard ? 'gray.200' : 'gray.50' }}
      _active={{ bg: asBlockCard ? 'gray.200' : 'gray.50' }}
      fontWeight="normal"
      bg="gray.50"
      position="relative"
      role={asBlockCard ? 'group' : 'none'}
      wordBreak="break-word"
      whiteSpace="normal"
      onClick={handleClick ? handleClick : () => {}}
      border={activeBorder ? '1px solid indigo' : '1px solid transparent'}
    >
      {asBlockCard && (
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
      )}
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
          opacity={asBlockCard ? 0 : 1}
          _groupHover={{ opacity: 1 }}
        >
          <SmallText fontWeight="light">
            Contributed by {username} {moment(createdAt).fromNow()}
          </SmallText>
          {!asBlockCard ? (
            <HStack>
              {liked ? (
                <AiFillHeart
                  onClick={handleLike}
                  style={{
                    cursor: 'pointer',
                    fill: 'var(--chakra-colors-blue-200)',
                  }}
                />
              ) : (
                <AiOutlineHeart
                  onClick={handleLike}
                  style={{ cursor: 'pointer' }}
                />
              )}
              <SmallText>{likes} Likes</SmallText>
            </HStack>
          ) : null}
        </HStack>
      </VStack>
    </Button>
  )
}
