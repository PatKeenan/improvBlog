import { Link as ChakraLink } from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
export const LoginButton = () => {
  const { data: session } = useSession();
  if (session) {
    return <ChakraLink onClick={() => signOut()}>Sign out</ChakraLink>;
  }
  return (
    <>
      <Link href="/signin" passHref>
        <ChakraLink>Sign in</ChakraLink>
      </Link>
    </>
  );
};
