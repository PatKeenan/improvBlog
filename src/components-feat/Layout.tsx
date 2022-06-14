import { LoginButton } from '@components-common';
import { useSession } from 'next-auth/react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Box,
  HStack,
  LinkBox,
  LinkOverlay,
  chakra,
  Avatar,
  Link as ChakraLink,
} from '@chakra-ui/react';

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
  const { data: session } = useSession();
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
        {session && session.user ? (
          <>
            {/* @ts-ignore */}
            <Link href={`/users/${session.user?.id ?? ''}`} passHref>
              <ChakraLink>{session.user.name}</ChakraLink>
            </Link>
            <Avatar src={session.user?.image ?? ''} size="sm" />
          </>
        ) : null}
      </HStack>
      <LoginButton />
    </HStack>
  );
};
