import {Box, Container, HStack, Stack, VStack} from '@chakra-ui/react'
import Link from 'next/link'
import type {ReactNode} from 'react'

export default function Layout({children}: {children: ReactNode}) {
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
      shadow={'base'}
      p="4"
      h={{base: '75px'}}
      alignItems="center"
    >
      <Box w="100px">Logo</Box>
      <Box flexGrow={1}>Search Bar</Box>
      <HStack>
        <Link href={'/signin'}>Login</Link>
      </HStack>
    </HStack>
  )
}
