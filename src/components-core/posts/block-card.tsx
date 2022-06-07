import { Card, Paragraph, SmallText } from '@components-common';
import { Box, HStack, VStack } from '@chakra-ui/react';
import type { ButtonProps } from '@chakra-ui/react';
import { Contribution, User } from '@prisma/client';
import moment from 'moment';

interface BlockCardType extends ButtonProps {
  content: Contribution['content'];
  createdAt: Contribution['createdAt'];
  username: User['username'];
  likes: Contribution['likes'];
  contributionTotal: number;
  activeBorder: boolean;
  handleClick: () => void;
}

export const BlockCard = ({
  content,
  createdAt,
  username,
  contributionTotal,
  likes,
  activeBorder,
  handleClick,

  ...rest
}: BlockCardType) => (
  <Card
    as="button"
    _hover={{ bg: 'gray.200' }}
    _active={{ bg: 'gray.200' }}
    role={'group'}
    onClick={handleClick}
    border={activeBorder ? '1px solid indigo' : '1px solid transparent'}
    {...rest}
  >
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

    <VStack display="flex" flexDir="column" w="full" alignItems={'flex-start'}>
      <Paragraph textAlign="left">{content}</Paragraph>
      <HStack
        align="center"
        justify="space-between"
        w="full"
        spacing="4"
        opacity={0}
        _groupHover={{ opacity: 1 }}
      >
        <SmallText fontWeight="light">
          Contributed by {username} {moment(createdAt).fromNow()}
        </SmallText>
        <SmallText>{likes} Likes</SmallText>
      </HStack>
    </VStack>
  </Card>
);
