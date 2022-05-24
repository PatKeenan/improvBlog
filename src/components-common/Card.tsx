import {HStack, VStack, Link as ChakraLink, Container} from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import {H3, Paragraph} from './Typography'

export const Card = ({
  children,
  link,
}: {
  children: React.ReactNode
  link?: string
}) => {
  const CardContent = () => (
    <VStack
      bg="gray.50"
      borderRadius={'2xl'}
      p="4"
      spacing="2"
      align="flex-start"
    >
      {children}
    </VStack>
  )
  return link ? (
    <Container>
      <Link href={{pathname: `posts/${encodeURIComponent(link)}`}} passHref>
        <ChakraLink width="full">
          <CardContent />
        </ChakraLink>
      </Link>
    </Container>
  ) : (
    <CardContent />
  )
}

export const CardTitle = ({children}: {children: React.ReactNode}) => (
  <H3 textTransform="capitalize">{children}</H3>
)
export const CardContent = ({
  children,
}: {
  children: React.ReactNode | string
}) => <Paragraph>{children}</Paragraph>
export const CardFooter = ({children}: {children: React.ReactNode}) => (
  <HStack justify="space-between" my="2" w="100%">
    {children}
  </HStack>
)
