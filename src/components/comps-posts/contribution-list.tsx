import { ContributionCard, ContributeButton } from '@components/comps-posts';
import { useContributionStore } from '@lib/useContributionStore';
import { useContributions } from '@lib/useContributions';
import { Box, Button, VStack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import type { Block } from '@prisma/client';
import { Determine } from '@components';
import { useRouter } from 'next/router';

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

  const { data, isError, fetchNextPage, isLoading, isFetching, hasNextPage } =
    getAllByBlock(blockId);

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
    error: isError,
    loading: isLoading,
    component: data?.pages ? (
      <>
        <Box w="full">
          <ContributeButton
            message="Add Contribution"
            handleClick={handleClickAdd}
          />
        </Box>
        <VStack w="full" overflow="auto" h="100%">
          {data.pages.map(page => {
            return page.contributions.map(contribution => (
              <ContributionCard
                key={contribution.contribution_uuid}
                activeBorder={false}
                contribution={contribution}
                post_uuid={post_uuid}
                postId={postId}
                blockId={blockId}
              />
            ));
          })}
          {hasNextPage ? (
            <Button
              onClick={() => fetchNextPage()}
              isLoading={isFetching && !isLoading}
            >
              Load More
            </Button>
          ) : null}
        </VStack>
      </>
    ) : null,
  });
};
