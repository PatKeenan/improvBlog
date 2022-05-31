import { yupResolver } from '@hookform/resolvers/yup'
import { auth } from '@lib/mutations/auth-mutations'
import { signUpSchema } from '@lib/formValidations'
import { SmallText } from '@components-common'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { AuthForm } from './auth-form'
import type { NextPage } from 'next'

import Link from 'next/link'

import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  Link as ChakraLink,
  HStack,
  InputLeftAddon,
  InputGroup,
} from '@chakra-ui/react'
import React from 'react'

export const SignUpContainer: NextPage = () => {
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<{
    username: string
    email: string
    password: string
    confirmPassword: string
  }>({
    resolver: yupResolver(signUpSchema),
  })

  const onSubmit = handleSubmit(async data => {
    const user = await auth('signup', {
      email: data.email,
      password: data.password,
      username: data.username,
    })
    if (user.error) {
      return setError(user.error.field, { message: user.error.message })
    }
    if (user) {
      return router.push('/')
    }
  })

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
        <AuthForm title="Sign Up To Read Awesome Stuff">
          <form onSubmit={onSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.username as boolean | undefined}>
                <FormLabel htmlFor="username">Username</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="@" />
                  <Input
                    id="username"
                    placeholder="Username"
                    {...register('username')}
                  />
                </InputGroup>
                <FormErrorMessage textTransform="capitalize">
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.email as boolean | undefined}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input id="email" placeholder="Email" {...register('email')} />
                <FormErrorMessage textTransform="capitalize">
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.password as boolean | undefined}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...register('password')}
                />
                <FormErrorMessage textTransform="capitalize">
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={errors.confirmPassword as boolean | undefined}
              >
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  {...register('confirmPassword')}
                />
                <FormErrorMessage textTransform="capitalize">
                  {errors.confirmPassword && errors.confirmPassword.message}
                </FormErrorMessage>
              </FormControl>
              <HStack justify={'space-between'} w="full">
                <SmallText>
                  Already a user?{' '}
                  <Link href={{ pathname: '/signin' }} passHref>
                    <ChakraLink color="blue.500">Sign In</ChakraLink>
                  </Link>
                </SmallText>

                <Button
                  variant="solid"
                  colorScheme="blue"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Sign Up
                </Button>
              </HStack>
            </VStack>
          </form>
        </AuthForm>
      </Container>
    </Flex>
  )
}

// Change the layout by setting display name and checking in _app.tsx
SignUpContainer.displayName = 'signUp'
