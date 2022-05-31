import { H2, SmallText } from '@components-common'
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { AuthForm } from './auth-form'
import type { NextPage } from 'next'
import Link from 'next/link'
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
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { auth } from '@lib/mutations/auth-mutations'
import { useRouter } from 'next/router'

export const SignInContainer: NextPage = () => {
  const router = useRouter()
  const toast = useToast()
  const formOptions = {
    resolver: yupResolver(
      Yup.object().shape({
        email: Yup.string()
          .required('Email is required')
          .email('Must be a valid email'),
        password: Yup.string()
          .required('Password is required')
          .min(6, 'Password must be at least 6 characters'),
      }),
    ),
  }
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm(formOptions)

  const onSubmit = handleSubmit(async data => {
    const user = await auth('signin', {
      email: data.email,
      password: data.password,
    })
    if (user.error) {
      return toast({
        isClosable: true,
        duration: 2000,
        title: 'Incorrect Email or Password',
        status: 'error',
      })
    }
    return router.push('/')
  })

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
              <FormControl isInvalid={errors.name}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input id="email" placeholder="Email" {...register('email')} />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
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
  )
}
