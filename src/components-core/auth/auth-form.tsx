import { Box, useColorModeValue } from '@chakra-ui/react'
import { H2 } from '@components-common'
import React from 'react'

export const AuthForm = ({
  children,
  title,
}: {
  children: React.ReactNode | React.ReactNode[]
  title: string
}) => {
  ///////////////////////////////////////////////
  return (
    <>
      <H2 textAlign={'center'} marginBottom={4} textColor="gray.700">
        {title}
      </H2>
      <Box
        border="1px"
        borderColor="gray.200"
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        shadow={'lg'}
        p={8}
      >
        {children}
      </Box>
    </>
  )
}
