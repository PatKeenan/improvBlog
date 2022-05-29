import { SmallText } from '@components-common'
import { useForm } from 'react-hook-form'
import { AuthForm } from './auth-form'
import type { NextPage } from 'next'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
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
} from '@chakra-ui/react'
import React from 'react'
import { auth } from '@lib/auth'
import { useRouter } from 'next/router'

type FormType = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export const SignUpContainer: NextPage = () => {
  const router = useRouter()

  const formOptions = {
    resolver: yupResolver(
      Yup.object().shape({
        username: Yup.string()
          .required('Username is required')
          .min(4, 'Username must be at least 4 characters long.')
          .trim(),
        email: Yup.string()
          .required('Email is required')
          .email('Must be a valid email')
          .trim(),
        password: Yup.string()
          .required('Password is mandatory')
          .min(6, 'Password must be at 3 char long')
          .trim()
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
          ),
        confirmPassword: Yup.string()
          .required('Password is mandatory')
          .min(6)
          .trim()
          .oneOf([Yup.ref('password')], 'Passwords does not match'),
      }),
    ),
  }

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormType>(formOptions)

  const onSubmit = handleSubmit(async data => {
    const { data: user, error } = await auth('signup', {
      email: data.email,
      password: data.password,
      username: data.username,
    })
    if (error && !user) {
      return setError(error.field, { message: error.message })
    }
    if (user) {
      return router.push('/')
    }
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
        <AuthForm title="Sign Up To Read Awesome Stuff">
          <form onSubmit={onSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.username as boolean | undefined}>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  id="username"
                  placeholder="Username"
                  {...register('username')}
                />
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
