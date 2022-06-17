import type { ButtonProps } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';

import React from 'react';

export interface CardProps extends ButtonProps {}
export const Card = (props: CardProps) => (
  <Button
    h="auto"
    w="full"
    px="4"
    pb="4"
    pt="6"
    fontWeight="normal"
    bg="gray.50"
    position="relative"
    wordBreak="break-word"
    whiteSpace="normal"
    {...props}
  />
);
