import { H2, SmallText } from '@components-common'
import { useForm } from 'react-hook-form'
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
} from '@chakra-ui/react'

export const SignUpContainer: NextPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = () => {}
  const loading = false
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.username}>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  id="username"
                  placeholder="Username"
                  {...register('username', {
                    required: true,
                    maxLength: {
                      value: 25,
                      message: 'Username is to long',
                    },
                    minLength: {
                      value: 4,
                      message: 'Username should be at least 4 characters',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...register('email', {
                    required: true,
                    minLength: {
                      value: 4,
                      message: 'Minimum length should be 4',
                    },
                  })}
                />
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
                  {...register('password', {
                    required: true,
                    minLength: {
                      value: 4,
                      message: 'Minimum length should be 4',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.confirmPassword}>
                <FormLabel htmlFor="password">Confirm Password</FormLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  {...register('confirmPassword', {
                    required: true,
                    minLength: {
                      value: 4,
                      message: 'Minimum length should be 4',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              <HStack justify={'space-between'} w="full">
                <SmallText>
                  Already a user?{' '}
                  <Link href={{ pathname: '/signin' }} passHref>
                    <ChakraLink color="blue.500">Sign In</ChakraLink>
                  </Link>
                </SmallText>

                <Button variant="solid" colorScheme="blue" type="submit">
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
