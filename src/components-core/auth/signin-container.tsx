import { useRouter } from 'next/router';
import { AuthForm } from './auth-form';

import type { NextPage } from 'next';
import { FcGoogle } from 'react-icons/fc';

import { Flex, Button, Container } from '@chakra-ui/react';
import React from 'react';
import {
  getProviders,
  signIn,
  useSession,
  LiteralUnion,
  ClientSafeProvider,
} from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';

export const SignInContainer: NextPage = () => {
  const router = useRouter();

  const [providers, setProviders] = React.useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>();

  const { data: session, status } = useSession();

  React.useEffect(() => {
    const setTheProviders = async () => {
      const setUpProviders = await getProviders();
      setProviders(setUpProviders);
    };
    setTheProviders();
  }, []);

  React.useEffect(() => {
    if (session) {
      router.push('/');
    }
  });

  /* const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
  }); */

  /*  const onSubmit = handleSubmit(async data => {
    const user = await auth('signin', {
      email: data.email,
      password: data.password,
    });
    if (user.error) {
      return toast({
        isClosable: true,
        duration: 2000,
        title: 'Incorrect Email or Password',
        status: 'error',
      });
    }
    return router.push('/');
  }); */

  ///////////////////////////////////////////////

  return status === 'loading' ? (
    <p>Loading...</p>
  ) : (
    <Flex
      h={'100vh'}
      w="100vw"
      align={'center'}
      justify={'center'}
      flexGrow={1}
    >
      <Container>
        <AuthForm title="Sign In To Read Awesome Stuff">
          {/* <form onSubmit={onSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.email as boolean | undefined}>
                <FormLabel>Email</FormLabel>
                <Input id="email" placeholder="Email" {...register('email')} />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.password as boolean | undefined}>
                <FormLabel>Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...register('password')}
                />
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              <HStack justify={'space-between'} w="full">
                <SmallText>
                  Don&apos;t have an account?{' '}
                  <Link href={{ pathname: '/signup' }} passHref>
                    <ChakraLink color="blue.500">Sign Up</ChakraLink>
                  </Link>
                </SmallText>

                <Button
                  variant="solid"
                  colorScheme="blue"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Sign In
                </Button>
              </HStack>
            </VStack>
          </form> */}
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
        </AuthForm>
      </Container>
    </Flex>
  );
};

// Change the layout by setting display name and checking in _app.tsx
SignInContainer.displayName = 'signIn';
