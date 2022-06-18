;
import type { Context } from 'pages/api/trpc/[trpc]';
import * as trpc from '@trpc/server';

/**
 * Helper function to create a router with context
 */
 interface Meta {
  hasAuth?: boolean
}
export function createRouter() {
  return trpc.router<Context, Meta >();
}