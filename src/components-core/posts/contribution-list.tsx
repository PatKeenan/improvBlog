import { ContributionCard, ContributeButton } from '@components-core/posts';
import { Determine } from '@components-feat';
import type { Block, User } from '@prisma/client';
import { useContributions } from '@lib/useContributions';
import { Box, VStack } from '@chakra-ui/react';
import { useContributionStore } from '@lib/useContributionStore';
import { useRouter } from 'next/router';

export const ContributionList = ({
  blockId,
  user,
}: {
  blockId: Block['id'];
  user: User | undefined;
}) => {
  const { contributions, loading, error } = useContributions(blockId);
  const { toggleModalOpen } = useContributionStore();
  const router = useRouter();
  const handleClickAdd = () => {
    if (user) {
      return toggleModalOpen();
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
            />
          ))}
        </VStack>
      </>
    ) : null,
  });
};
