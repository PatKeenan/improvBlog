import { useContributionStore } from '@lib/useContributionStore';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { Button, HStack, VStack } from '@chakra-ui/react';
import { useContributions } from '@lib/useContributions';
import { Card, Paragraph, SmallText } from '@components';
import type { Contribution } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { IoMdTrash } from 'react-icons/io';
import { VscEdit } from 'react-icons/vsc';
import moment from 'moment';
import React from 'react';

export const ContributionCard = ({
  contribution,
  activeBorder,
  handleClick,
  post_uuid,
  postId,
  blockId,
}: {
  contribution: Contribution & {
    author: {
      name: string | null;
    };
    likes: any[];
  };
  activeBorder: boolean;
  handleClick?: () => void;
  post_uuid: string;
  postId: number;
  blockId: number;
}) => {
  const { data: session } = useSession();
  const { toggleEdit } = useContributionStore();
  const [isLiked, setIsLiked] = React.useState(
    contribution.likes.includes(session?.user.id),
  );

  React.useEffect(() => {
    const likerIds = contribution.likes.map(i => i.likerId);
    const userIDInLikerIds = likerIds.includes(session?.user.id);
    setIsLiked(userIDInLikerIds);
  }, [contribution.likes, session?.user.id]);

  const { deleteContrib, likeContrib, unlike } = useContributions(post_uuid);
  const { mutate, isLoading } = deleteContrib();
  const { mutate: like } = likeContrib();
  const { mutate: unlikeContrib } = unlike();

  const handleUnlikeContrib = async () => {
    const targetId = contribution.likes.filter(
      i => i.likerId === session?.user.id,
    );
    if (targetId) {
      return unlikeContrib({ likedID: targetId[0].id });
    }
  };

  const handleLikeContrib = async () => {
    like({
      postId: postId,
      blockId: blockId,
      contributionId: contribution.id,
    });
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
            {isLiked ? (
              <AiFillHeart
                onClick={handleUnlikeContrib}
                style={{
                  cursor: 'pointer',
                  fill: 'var(--chakra-colors-blue-200)',
                }}
              />
            ) : (
              <AiOutlineHeart
                onClick={handleLikeContrib}
                style={{ cursor: 'pointer' }}
              />
            )}
            <SmallText>{contribution.likes.length}</SmallText>
          </HStack>
        </HStack>
        {session?.user?.id === contribution.authorId && (
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
