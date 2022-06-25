import type { NextPage } from 'next';
import { FcGoogle } from 'react-icons/fc';
import { Flex, Button, Container, Box } from '@chakra-ui/react';
import React from 'react';
import {
  getProviders,
  signIn,
  LiteralUnion,
  ClientSafeProvider,
} from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import Image from 'next/image';
import { H2 } from '@components/Typography';

export const SignInContainer: NextPage = () => {
  const [providers, setProviders] = React.useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>();

  React.useEffect(() => {
    const setTheProviders = async () => {
      const setUpProviders = await getProviders();
      setProviders(setUpProviders);
    };
    setTheProviders();
  }, []);

  ///////////////////////////////////////////////

  return (
    <Flex
      h={'100vh'}
      w="100vw"
      align={'center'}
      justify={'center'}
      flexGrow={1}
    >
      <Container>
        <H2 textAlign={'center'} textColor="gray.700">
          Sign in to Contribute
        </H2>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          mt={2}
          mb={4}
        >
          <Image src="/signin.svg" height="300px" width="300px" alt="Sign in" />
        </Box>

        <Flex w="full">
          <Button
            marginInlineStart="auto"
            marginInlineEnd="auto"
            leftIcon={<FcGoogle />}
            onClick={() => signIn(providers?.google.id)}
          >
            Continue with google
          </Button>
        </Flex>
      </Container>
    </Flex>
  );
};
export default SignInContainer;

// Change the layout by setting display name and checking in _app.tsx
SignInContainer.displayName = 'signIn';
