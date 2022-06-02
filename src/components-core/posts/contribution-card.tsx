import { Card, Paragraph, SmallText } from '@components-common';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import type { Contribution, User } from '@prisma/client';
import { HStack, VStack } from '@chakra-ui/react';
import { useMe } from '@lib/useMe';
import moment from 'moment';
import React from 'react';

export const ContributionCard = ({
  content,
  createdAt,
  username,
  likes,
  activeBorder,
  handleClick,
}: {
  content: Contribution['content'];
  createdAt: Contribution['createdAt'];
  username: User['username'];
  likes: Contribution['likes'];
  activeBorder: boolean;
  handleClick?: () => void;
}) => {
  const { user, loading } = useMe();

  const [liked, setLiked] = React.useState(false);
  const handleLike = () => {
    user ? setLiked(!liked) : null;
  };
  return (
    <Card
      as="div"
      _hover={{ bg: 'gray.50' }}
      _active={{ bg: 'gray.50' }}
      role={'none'}
      onClick={handleClick ? handleClick : () => {}}
      border={activeBorder ? '1px solid indigo' : '1px solid transparent'}
    >
      <VStack
        display="flex"
        flexDir="column"
        w="full"
        alignItems={'flex-start'}
      >
        <Paragraph textAlign="left">{content}</Paragraph>
        <HStack align="center" justify="space-between" w="full" spacing="4">
          <SmallText fontWeight="light">
            Contributed by {username} {moment(createdAt).fromNow()}
          </SmallText>

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
        </HStack>
      </VStack>
    </Card>
  );
};
