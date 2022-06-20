/**
 * This file contains the root router of your tRPC-backend
 */
 import { createRouter } from '../createRouter';
 import { postsRouter } from './posts.router';
 import superjson from 'superjson';
import { ZodError } from 'zod';
import { contributionRouter } from './contributions.router';
 
 /**
  * Create your application's root router
  * If you want to use SSG, you need export this
  * @link https://trpc.io/docs/ssg
  * @link https://trpc.io/docs/router
  */
 export const appRouter = createRouter()
   /**
    * Add data transformers
    * @link https://trpc.io/docs/data-transformers
    */
   .transformer(superjson)
   .formatError(({shape, error}) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError
            ? error.cause
            : null,
      }
    };
   })
   /**
    * Optionally do custom error (type safe!) formatting
    * @link https://trpc.io/docs/error-formatting
   })
   
   /**
    * Merge `postRouter` under `posts.`
    */
   .merge('posts.', postsRouter)
   .merge('contributions.', contributionRouter)
 
 export type AppRouter = typeof appRouter;