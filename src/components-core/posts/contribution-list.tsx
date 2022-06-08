import { ContributionCard, ContributeButton } from '@components-core/posts';
import { Determine } from '@components-feat';
import type { Block } from '@prisma/client';
import { useContributions } from '@lib/useContributions';
import { Box, VStack } from '@chakra-ui/react';
import { useContributionStore } from '@lib/useContributionStore';

export const ContributionList = ({ blockId }: { blockId: Block['id'] }) => {
  const { contributions, loading, error } = useContributions(blockId);
  const { toggleModalOpen } = useContributionStore();
  return Determine({
    error,
    loading,
    component: contributions ? (
      <>
        <Box w="full">
          <ContributeButton
            message="Add Contribution"
            handleClick={toggleModalOpen}
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
