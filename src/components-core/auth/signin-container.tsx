import { yupResolver } from '@hookform/resolvers/yup';
import { signInSchema } from '@lib/formValidations';
import { SmallText } from '@components-common';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { AuthForm } from './auth-form';
import { auth } from '@lib/mutations';
import type { NextPage } from 'next';

import Link from 'next/link';

import {
  Flex,
  FormControl,
  Input,
  Button,
  useToast,
  FormLabel,
  Container,
  FormErrorMessage,
  VStack,
  HStack,
  Link as ChakraLink,
} from '@chakra-ui/react';
import React from 'react';

export const SignInContainer: NextPage = () => {
  const router = useRouter();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = handleSubmit(async data => {
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
  });

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
        <AuthForm title="Sign In To Read Awesome Stuff">
          <form onSubmit={onSubmit}>
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
                  Don't have an account?{' '}
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
          </form>
        </AuthForm>
      </Container>
    </Flex>
  );
};

// Change the layout by setting display name and checking in _app.tsx
SignInContainer.displayName = 'signIn';
