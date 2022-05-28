import { ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react'
import { ErrorBoundary, Layout } from '@components-feat'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

const customTheme = extendTheme()

const nonLayoutRoutes = ['signIn', 'signUp']

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <ErrorBoundary fallback={<p>An application error has occurred</p>}>
        {!nonLayoutRoutes.includes(Component.displayName as string) ? (
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
