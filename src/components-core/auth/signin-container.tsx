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

export const SignInContainer: NextPage = () => {
  const [loading, setLoading] = useState(false)

  const toast = useToast()

  const handleLogin = async (e: React.SyntheticEvent) => {
    try {
      setLoading(true)

      toast({
        title: 'Magic Link Sent.',
        description: "We've beamed a secret link to your email.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    } catch (error) {
      //@ts-ignore
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }
  /*   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const { email, password } = Object.fromEntries(formData) as {
      email: string
      password: string
    }
  } */

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

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
          <form onSubmit={handleSubmit(() => {})}>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.name}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  placeholder="Email"
                  {...register('email', {
                    required: true,
                    minLength: {
                      value: 4,
                      message: 'Minimum length should be 4',
                    },
                    pattern:
                      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
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
              <HStack justify={'space-between'} w="full">
                <SmallText>
                  Don't have an account?{' '}
                  <Link href={{ pathname: '/signup' }} passHref>
                    <ChakraLink color="blue.500">Sign Up</ChakraLink>
                  </Link>
                </SmallText>

                <Button variant="solid" colorScheme="blue" type="submit">
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
