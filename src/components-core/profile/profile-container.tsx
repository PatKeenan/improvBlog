import { useProfile } from '@lib/useUsers'
import { Avatar } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import faker from '@faker-js/faker'
import type { NextPage } from 'next'

export const ProfileContainer: NextPage = () => {
  const router = useRouter()
  const { id } = router.query as unknown as { id: string }
  const { profile, loading, error } = useProfile(id)

  return profile ? (
    <div>
      <Avatar src={profile.profilePic ?? faker.image.cats()} />
      <p>Hello from the profile page!</p>
    </div>
  ) : (
    <p>hello</p>
  )
}
