import {Box, HStack, Spinner} from '@chakra-ui/react'
import {H3} from '@components-common'
import React from 'react'

/**
 *
 * Determine is used with any component that fetches data using useSWR.
 * It takes three arguments,
 * @param error : A generic type kicked back by the hook. Renders Error
 * @param loading : A boolean value, returns Loading...
 * @param component : If no error and loading is present, the component will render.
 *  If it get past all of those and theres no data, it will render null
 */

interface DetermineProps<U, V> {
  component: JSX.Element | null
  error: U
  loading: V
}

export const Determine = <U extends unknown, V extends unknown>({
  error,
  loading,
  component,
}: DetermineProps<U, V>) => {
  if (loading || error) {
    return (
      <Box display="flex" w="full" placeItems="center" h="full" flexGrow={1}>
        <HStack flexGrow={1} justify="center">
          {loading && !error ? (
            <>
              <H3>Loading</H3>
              <Spinner size="xl" />
            </>
          ) : (
            <H3>Error</H3>
          )}
        </HStack>
      </Box>
    )
  }
  return component
}
