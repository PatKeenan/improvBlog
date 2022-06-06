import { ContributionCard } from '@components-core/posts';
import { Determine } from '@components-feat';
import type { Block } from '@prisma/client';
import { useBlocks } from '@lib/useBlock';

export const ContributionList = ({ blockId }: { blockId: Block['id'] }) => {
  const { data, loading, error } = useBlocks(blockId);

  return Determine({
    error,
    loading,
    component: data ? (
      <>
        {data.contributions.map(contribution => (
          <ContributionCard
            key={contribution.contribution_uuid}
            activeBorder={false}
            contribution={contribution}
          />
        ))}
      </>
    ) : null,
  });
};
