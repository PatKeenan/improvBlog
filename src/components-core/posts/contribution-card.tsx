import { Card, Paragraph, SmallText } from '@components-common';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import type { Contribution, User } from '@prisma/client';
import { Button, HStack, VStack } from '@chakra-ui/react';
import { IoMdTrash } from 'react-icons/io';
import { VscEdit } from 'react-icons/vsc';
import { useMe } from '@lib/useMe';
import moment from 'moment';
import React from 'react';
import { useContributionStore } from '@lib/useContributionStore';

interface ContributionType extends Contribution {
  author: User;
}

export const ContributionCard = ({
  contribution,
  activeBorder,
  handleClick,
}: {
  contribution: ContributionType;
  activeBorder: boolean;
  handleClick?: () => void;
}) => {
  const { user } = useMe();
  const { toggleEdit } = useContributionStore();
  const [liked, setLiked] = React.useState(false);
  const handleLike = () => {
    return user && setLiked(!liked);
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
        <Paragraph textAlign="left">{contribution.content}</Paragraph>
        <HStack align="center" justify="space-between" w="full" spacing="4">
          <SmallText fontWeight="light">
            Contributed by {contribution.author.username}{' '}
            {moment(contribution.createdAt).fromNow()}
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
            <SmallText>{contribution.likes} Likes</SmallText>
          </HStack>
        </HStack>
        {user?.id === contribution.authorId && (
          <HStack>
            <Button
              size="xs"
              leftIcon={<VscEdit />}
              onClick={() =>
                toggleEdit({
                  content: contribution.content,
                  blockId: contribution.blockId,
                  contributionId: contribution.id,
                })
              }
            >
              Edit
            </Button>
            <Button size="xs" leftIcon={<IoMdTrash />}>
              Delete
            </Button>
          </HStack>
        )}
      </VStack>
    </Card>
  );
};
