import { ContributionCard, ContributeButton } from '@components/comps-posts';
import { useContributionStore } from '@lib/useContributionStore';
import { useContributions } from '@lib/useContributions';
import type { Block } from '@prisma/client';
import { Box, VStack } from '@chakra-ui/react';
import { Determine } from '@components';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export const ContributionList = ({
  blockId,
  post_uuid,
  postId,
}: {
  blockId: Block['id'];
  post_uuid: string;
  postId: number;
}) => {
  const { getAllByBlock } = useContributions(post_uuid);
  const {
    data: contributions,
    isError: error,
    isLoading: loading,
  } = getAllByBlock(blockId);
  const { toggleModalOpen } = useContributionStore();
  const router = useRouter();
  const { data: session } = useSession();
  const handleClickAdd = () => {
    if (session?.user) {
      return toggleModalOpen(blockId, postId);
    }
    return router.push('/signin');
  };

  return Determine({
    error,
    loading,
    component: contributions ? (
      <>
        <Box w="full">
          <ContributeButton
            message="Add Contribution"
            handleClick={handleClickAdd}
          />
        </Box>
        <VStack w="full" overflow="auto" h="100%">
          {contributions.map(contribution => (
            <ContributionCard
              key={contribution.contribution_uuid}
              activeBorder={false}
              contribution={contribution}
              post_uuid={post_uuid}
              postId={postId}
              blockId={blockId}
            />
          ))}
        </VStack>
      </>
    ) : null,
  });
};
