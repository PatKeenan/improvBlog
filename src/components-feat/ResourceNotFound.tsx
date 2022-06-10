import { Button, VStack } from '@chakra-ui/react';
import { H3 } from '@components-common';
import Image from 'next/image';
import Link from 'next/link';

export const ResourceNotFound = ({
  message = 'Resources Not Found',
  href = '/',
  title = 'Return Home',
}: {
  message?: string;
  href?: string;
  title?: string;
}) => (
  <VStack
    w="full"
    height="calc(100vh - 75px)"
    spacing={3}
    align="center"
    justify="center"
    flexGrow={1}
  >
    <H3 fontWeight={'semibold'}>{message}</H3>
    <Image src={'/not-found.svg'} height={400} width={400} alt={message} />

    <Link href={href}>
      <Button colorScheme="blue">{title}</Button>
    </Link>
  </VStack>
);
