import {
  Flex,
  Box,
  FormControl,
  Input,
  Stack,
  Button,
  useColorModeValue,
  useToast,
  FormLabel,
  Container,
} from '@chakra-ui/react'
import type {NextPage} from 'next'
import React, {useState} from 'react'

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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const {email, password} = Object.fromEntries(formData) as {
      email: string
      password: string
    }
  }

  return (
    <Flex
      h={'100vh'}
      w="100vw"
      align={'center'}
      justify={'center'}
      bg={'gray.800'}
      flexGrow={1}
    >
      <Container>
        <Stack spacing={8} mx={'auto'} py={12} px={6} minWidth={'400px'}>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel>Email</FormLabel>
                  <Input
                    placeholder="Enter Email..."
                    type="email"
                    name="email"
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input type="password" name="password" />
                </FormControl>
                <Stack spacing={10}>
                  <Button
                    type="submit"
                    bg={'blue.400'}
                    color={'white'}
                    disabled={loading}
                    _hover={{
                      bg: 'blue.500',
                    }}
                  >
                    <span>{loading ? 'Loading' : 'Sign In'}</span>
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Container>
    </Flex>
  )
}
