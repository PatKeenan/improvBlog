import { Box, HStack, LinkBox, LinkOverlay, VStack } from '@chakra-ui/react';
import { Link as ChakraLink } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { logout } from '@lib/mutations';
import type { ReactNode } from 'react';
import { useMe } from '@lib/useMe';
import Image from 'next/image';
import Link from 'next/link';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <VStack minH={'100vh'} w={'100vw'} flex={1}>
      <Header />
      <VStack
        as="main"
        display="flex"
        flexGrow={1}
        w="100%"
        maxW={'container.xl'}
      >
        {children}
      </VStack>
    </VStack>
  );
}

const Header = () => {
  const { user, mutate } = useMe();
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    mutate(undefined);
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
        <LinkBox>
          <Link href="/" passHref>
            <LinkOverlay>
              <Image src="/logo.svg" height={75} width={150} />
            </LinkOverlay>
          </Link>
        </LinkBox>
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
