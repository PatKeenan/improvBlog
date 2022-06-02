import { HStack, VStack, Link as ChakraLink, Box } from '@chakra-ui/react';
import { H3, Paragraph } from '@components-common';
import Link from 'next/link';
import React from 'react';

export const Card = ({
  children,
  link,
}: {
  children: React.ReactNode;
  link?: string;
}) => {
  /* const CardContent = () => (
    <VStack
      bg="gray.50"
      borderRadius={'2xl'}
      p="4"
      spacing="2"
      align="flex-start"
      w="full"
    >
      {children}
    </VStack>
  ); */
  return link ? (
    <Box w="full">
      <Link href={{ pathname: `posts/${encodeURIComponent(link)}` }} passHref>
        <ChakraLink width="full" _hover={{ textDecoration: 'none' }}>
          <VStack
            transition="ease"
            transitionProperty="all"
            transitionDuration="150ms"
            bg="gray.50"
            borderRadius={'2xl'}
            p="4"
            spacing="2"
            align="flex-start"
            w="full"
            _hover={{ bg: 'gray.200' }}
          >
            {children}
          </VStack>
        </ChakraLink>
      </Link>
    </Box>
  ) : (
    <CardContent>{children}</CardContent>
  );
};

export const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <H3 textTransform="capitalize">{children}</H3>
);

export const CardContent = ({
  children,
}: {
  children: React.ReactNode | string;
}) => <Paragraph>{children}</Paragraph>;

export const CardFooter = ({ children }: { children: React.ReactNode }) => (
  <HStack justify="space-between" my="2" w="100%">
    {children}
  </HStack>
);
