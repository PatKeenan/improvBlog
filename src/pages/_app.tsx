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
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { SessionProvider } from 'next-auth/react';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react';
import { ErrorBoundary, Layout } from '@components';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { withTRPC } from '@trpc/next';
import { AppRouter } from 'server/routers/_app';
import superjson from 'superjson';

const customTheme = extendTheme();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const authComponents = ['signIn', 'signUp'];
  ///////////////////////////////////////////////

  return (
    <SessionProvider session={session}>
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
    </SessionProvider>
  );
}

export default withTRPC<AppRouter>({
  config() {
    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: opts =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
})(MyApp);

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
