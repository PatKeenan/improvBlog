import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ErrorBoundary, Layout } from '@components-feat'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

const customTheme = extendTheme()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={customTheme}>
      <ErrorBoundary fallback={<p>An application error has occurred</p>}>
        {Component.displayName !== 'signIn' ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
      </ErrorBoundary>
    </ChakraProvider>
  )
}

export default MyApp
