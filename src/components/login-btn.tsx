import { Button } from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
export const LoginButton = () => {
  const { data: session } = useSession();
  if (session) {
    return <Button onClick={() => signOut()}>Sign out</Button>;
  }
  return (
    <>
      <Link href={'/signin'}>
        <Button>Sign in</Button>
      </Link>
    </>
  );
};
