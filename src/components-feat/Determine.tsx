/**
 *
 * Determine is used with any component that fetches data using useSWR.
 * It takes three arguments,
 * @param error : A generic type kicked back by the hook. Renders Error
 * @param loading : A boolean value, returns Loading...
 * @param component : If no error and loading is present, the component will render.
 *  If it get past all of those and theres no data, it will render null
 */

import { Box, HStack, Spinner } from '@chakra-ui/react';
import { H3 } from '@components-common';
import React from 'react';

interface DetermineProps<V> {
  component: JSX.Element | null;
  error: {
    message: string | null;
  };
  loading: V;
}

export const Determine = <V extends unknown>({
  error,
  loading,
  component,
}: DetermineProps<V>) => {
  if (loading || error) {
    return (
      <Box
        display="flex"
        w="full"
        placeItems="center"
        height="calc(100vh - 75px)"
      >
        <HStack justify="center" spacing={3} h="100%" w="100%">
          {loading && !error ? (
            <>
              <H3>Loading</H3>
              <Spinner size="lg" />
            </>
          ) : (
            <>
              <H3>Error:</H3>
              <H3>{error.message}</H3>
            </>
          )}
        </HStack>
      </Box>
    );
  }
  return component;
};
