import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {ChakraProvider, extendTheme} from '@chakra-ui/react'
import {ErrorBoundary} from '@components-feat/ErrorBoundary'
import Layout from '@components-feat/Layout'

const customTheme = extendTheme()

function MyApp({Component, pageProps}: AppProps) {
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
