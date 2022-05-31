/**
 *
 * --- Layout ---
 * If a components display name (set in the component) is included in the authComponents array, it will be wrapped in the Layout
 *
 * ---- Auth Components ----
 * signIn: @components-core/auth/signin-container
 * signUp: @components-core/auth/signup-container
 *
 */

import { ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react'
import { ErrorBoundary, Layout } from '@components-feat'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

const customTheme = extendTheme()

function MyApp({ Component, pageProps }: AppProps) {
  const authComponents = ['signIn', 'signUp']
  ///////////////////////////////////////////////

  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <ErrorBoundary fallback={<p>An application error has occurred</p>}>
        {authComponents.includes(Component.displayName as string) ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ErrorBoundary>
    </ChakraProvider>
  )
}

export default MyApp
