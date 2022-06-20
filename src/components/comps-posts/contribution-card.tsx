import { useContributionStore } from '@lib/useContributionStore';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { Button, HStack, VStack } from '@chakra-ui/react';
import { useContributions } from '@lib/useContributions';
import { Card, Paragraph, SmallText } from '@components';
import type { Contribution } from '@prisma/client';
import { IoMdTrash } from 'react-icons/io';
import { VscEdit } from 'react-icons/vsc';
import { useMe } from '@lib/useMe';
import moment from 'moment';
import React from 'react';

export const ContributionCard = ({
  contribution,
  activeBorder,
  handleClick,
  post_uuid,
}: {
  contribution: Contribution & {
    author: {
      name: string | null;
    };
  };
  activeBorder: boolean;
  handleClick?: () => void;
  post_uuid: string;
}) => {
  const { user } = useMe();
  const { toggleEdit } = useContributionStore();
  const [liked, setLiked] = React.useState(false);
  const { deleteContrib } = useContributions(post_uuid);
  const { mutate, isLoading } = deleteContrib();

  const handleLike = () => {
    return user && setLiked(!liked);
  };

  const handleDelete = async () => {
    mutate({ id: contribution.id });
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
            Contributed by {contribution.author.name}{' '}
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
                  selectedContributionId: contribution.id,
                })
              }
            >
              Edit
            </Button>
            <Button
              size="xs"
              leftIcon={<IoMdTrash />}
              onClick={handleDelete}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </HStack>
        )}
      </VStack>
    </Card>
  );
};
