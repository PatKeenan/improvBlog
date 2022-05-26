import { Box, HStack, VStack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import Link from 'next/link'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <VStack minH={'100vh'} w={'100vw'} flex={1}>
      <Header />
      <VStack as="main" display="flex" flexGrow={1} w="100%">
        {children}
      </VStack>
    </VStack>
  )
}

const Header = () => {
  return (
    <HStack
      w="100%"
      shadow="base"
      p={4}
      h={{ base: '75px' }}
      alignItems="center"
    >
      <HStack spacing="5">
        <Link href="/">Logo</Link>
        <Link href="/posts/">Posts</Link>
      </HStack>
      <Box flexGrow={1}>Search Bar</Box>
      <HStack>
        <Link href="/signin">Login</Link>
      </HStack>
    </HStack>
  )
}
