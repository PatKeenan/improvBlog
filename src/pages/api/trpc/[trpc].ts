import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from 'server/routers/_app';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import * as trpc from '@trpc/server';

const prismaGlobal = global as typeof global & {
    prisma?: PrismaClient;
  };
  
  const prisma: PrismaClient =
    prismaGlobal.prisma ||
    new PrismaClient({
      log:
        process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  
  if (process.env.NODE_ENV !== 'production') {
    prismaGlobal.prisma = prisma;
  }

// The app's context - is generated for each incoming request
export async function createContext({req, res}: trpcNext.CreateNextContextOptions) {
    // Create your context based on the request object
    // Will be available as `ctx` in all your resolvers
    const session = await getSession({req});
    
    return {
        req,
        res,
        prisma,
      session,
    };
  }
 export type Context = trpc.inferAsyncReturnType<typeof createContext>;




export default trpcNext.createNextApiHandler({
  router: appRouter,
  /**
   * @link https://trpc.io/docs/context
   */
  createContext,
  /**
   * @link https://trpc.io/docs/error-handling
   */
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      // eslint-disable-next-line no-console
      console.error('Something went wrong', error);
    }
  },
  /**
   * Enable query batching
   */
  batching: {
    enabled: true,
  },
  /**
   * @link https://trpc.io/docs/caching#api-response-caching
   */
  // responseMeta() {
  //   // ...
  // },
});