/* eslint-disable no-unused-vars */
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
        // The id returned after using a provider to log in
      id?: number
    } & DefaultSession["user"]
  }
}
