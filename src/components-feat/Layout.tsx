import { Box, Button, HStack, VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useMe } from '@lib/useMe';
import { Link as ChakraLink } from '@chakra-ui/react';
import { logout } from '@lib/mutations';
import { useRouter } from 'next/router';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <VStack minH={'100vh'} w={'100vw'} flex={1}>
      <Header />
      <VStack as="main" display="flex" flexGrow={1} w="100%">
        {children}
      </VStack>
    </VStack>
  );
}

const Header = () => {
  const { user, error, mutate } = useMe();
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    mutate(null);
    router.push('/signin');
  };
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
        {user ? (
          <>
            <Link href={`/users/${user.id}`} passHref>
              <ChakraLink>@{user.username}</ChakraLink>
            </Link>
            <ChakraLink as={'button'} onClick={handleLogout}>
              Logout
            </ChakraLink>
          </>
        ) : (
          <Link href="/signin">Login</Link>
        )}
      </HStack>
    </HStack>
  );
};
