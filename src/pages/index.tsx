import {
  Box,
  Button,
  HStack,
  VStack,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { H1, H2, H5, Paragraph, SmallText } from '@components';
import type { NextPage } from 'next';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import * as React from 'react';
import { BuiltInProviderType } from 'next-auth/providers';
import {
  getProviders,
  signIn,
  LiteralUnion,
  ClientSafeProvider,
} from 'next-auth/react';

export const HomeContainer: NextPage = () => {
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

  return (
    <VStack
      h="calc(100vh - 75px)"
      w="full"
      justifyContent={'center'}
      spacing="4"
      p="4"
    >
      <H1
        fontSize={['2xl', '4xl', '6xl']}
        textAlign="center"
        fontWeight="semibold"
        marginBottom={['0', '2']}
        maxW="800px"
      >
        Community story building one idea at a time
      </H1>
      <H2
        textAlign="center"
        fontWeight="normal"
        lineHeight="shorter"
        fontSize={{ sm: 'xl', md: '2xl' }}
        width="full"
        maxW="600px"
        marginInlineStart="auto"
        marginInlineEnd="auto"
        pt={1}
      >
        Start with a plot, watch others contribute, and see your story come to
        life in unexpected ways
      </H2>
      <VStack
        position="relative"
        bg="gray.100"
        borderRadius="md"
        px="6"
        py="2"
        w="full"
        maxW="500px"
        alignItems="flex-start"
        spacing="unset"
      >
        <Box
          position="absolute"
          top="0"
          right="0"
          bottom="0"
          left="0"
          bgGradient="linear(to-b, transparent, white)"
        ></Box>
        <H5 fontWeight="semibold">Super Intriguing Movie Title</H5>
        <HStack spacing="5">
          <SmallText>Creator: Userxyz</SmallText>
          <SmallText>Type: Film</SmallText>
          <SmallText>Genre: Horror</SmallText>
        </HStack>
        <Paragraph paddingTop={2}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Paragraph>
      </VStack>

      <HStack w="full">
        <Button
          marginInlineStart="auto"
          marginInlineEnd="auto"
          leftIcon={<FcGoogle />}
          onClick={() => signIn(providers?.google.id)}
        >
          Continue with google
        </Button>
      </HStack>
      <Link href="/posts" passHref={true}>
        <ChakraLink w="full" _focus={{ outline: 'none' }}>
          <SmallText
            fontSize="medium"
            fontWeight="medium"
            textAlign="center"
            pt={2}
          >
            or browse as a guest
          </SmallText>
        </ChakraLink>
      </Link>
    </VStack>
  );
};

export default HomeContainer;
