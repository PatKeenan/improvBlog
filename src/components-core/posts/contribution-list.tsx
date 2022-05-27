import { Paragraph, SmallText } from '@components-common'
import { useBlocks } from '@lib-client/useBlock'
import { Determine } from '@components-feat'
import type { Block } from '@prisma/client'
import { VStack } from '@chakra-ui/react'
import { ContributionCard } from './contribution-card'

export const ContributionList = ({ blockId }: { blockId: Block['id'] }) => {
  const { data, loading, error } = useBlocks(blockId)
  return Determine({
    error,
    loading,
    component: data ? (
      <>
        {data.contributions.map(contribution => (
          <ContributionCard
            key={contribution.contribution_uuid}
            activeBorder={false}
            content={contribution.content}
            createdAt={contribution.createdAt}
            username={contribution.author.username}
            likes={contribution.likes}
          />
        ))}
      </>
    ) : null,
  })
}
