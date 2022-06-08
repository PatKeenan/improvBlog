import { Box, HStack, LinkBox, LinkOverlay, chakra } from '@chakra-ui/react';
import { Link as ChakraLink } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { logout } from '@lib/mutations';
import type { ReactNode } from 'react';
import { useMe } from '@lib/useMe';
import Image from 'next/image';
import Link from 'next/link';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <chakra.main
        display="block"
        w="full"
        maxW="8xl"
        position="relative"
        marginInlineStart="auto"
        marginInlineEnd="auto"
        minHeight={'calc(100vh - 75px)'}
      >
        {children}
      </chakra.main>
    </>
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
      h={75}
      position="sticky"
      bg="white"
      zIndex={99}
      top={0}
      alignItems="center"
    >
      <HStack spacing="5">
        <LinkBox>
          <Link href="/" passHref>
            <LinkOverlay>
              <Image src="/logo.svg" height={75} width={150} alt="Logo" />
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
            <ChakraLink as={'button'} onClick={handleLogout} id="logout-button">
              Logout
            </ChakraLink>
          </>
        ) : (
          <Link href="/signin" id="login-button">
            Login
          </Link>
        )}
      </HStack>
    </HStack>
  );
};
