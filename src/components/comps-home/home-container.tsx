import {
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  VStack,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { H1, H2, H5, Paragraph, SmallText } from '@components';
import type { NextPage } from 'next';
import Link from 'next/link';

export const HomeContainer: NextPage = () => {
  return (
    <VStack
      h="calc(100vh - 75px)"
      w="full"
      justifyContent={'center'}
      spacing="4"
    >
      <Box w="759px" marginBottom="30px" marginTop={-20}>
        <H1
          textAlign="center"
          fontSize="6xl"
          fontWeight="semibold"
          lineHeight="3.75rem"
          marginBottom="2"
        >
          Community story building one idea at a time
        </H1>
        <H2
          textAlign="center"
          fontWeight="normal"
          lineHeight="shorter"
          fontSize="2xl"
          w="600px"
          marginInlineStart="auto"
          marginInlineEnd="auto"
          pt={1}
        >
          Start with a plot, watch others contribute, and see your story come to
          life in unexpected ways
        </H2>
      </Box>
      <VStack
        position="relative"
        bg="gray.100"
        borderRadius="md"
        px="6"
        py="2"
        w="500px"
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
      <form style={{ width: '450px' }}>
        <HStack w="full">
          <FormControl>
            <Input placeholder="Enter your email" borderColor="black" />
          </FormControl>
          <Button flexShrink={0} colorScheme="blackAlpha" bg="gray.900">
            Create account
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
      </form>
    </VStack>
  );
};
