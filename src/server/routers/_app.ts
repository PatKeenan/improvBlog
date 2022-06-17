/**
 * This file contains the root router of your tRPC-backend
 */
 import { createRouter } from '../createRouter';
 import { postsRouter } from './posts';
 import superjson from 'superjson';
import { ValidationError } from 'yup';
 
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
        yupError:
          error.cause instanceof ValidationError
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
    * Merge `postRouter` under `post.`
    */
   .merge('posts.', postsRouter);
 
 export type AppRouter = typeof appRouter;