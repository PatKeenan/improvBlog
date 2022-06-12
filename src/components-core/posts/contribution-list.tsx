import { ContributionCard, ContributeButton } from '@components-core/posts';
import { useContributionStore } from '@lib/useContributionStore';
import { useContributions } from '@lib/useContributions';
import type { Block, User } from '@prisma/client';
import { Box, VStack } from '@chakra-ui/react';
import { Determine } from '@components-feat';
import { useRouter } from 'next/router';

export const ContributionList = ({
  blockId,
  user,
  post_uuid,
}: {
  blockId: Block['id'];
  user: User | undefined;
  post_uuid: string;
}) => {
  const { contributions, loading, error } = useContributions(blockId);
  const { toggleModalOpen } = useContributionStore();
  const router = useRouter();
  const handleClickAdd = () => {
    if (user) {
      return toggleModalOpen(blockId);
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
            />
          ))}
        </VStack>
      </>
    ) : null,
  });
};
