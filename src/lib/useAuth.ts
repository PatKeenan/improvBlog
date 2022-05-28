import { User } from "@prisma/client";
import useSWR from "swr";
import fetcher from "./fetcher";

export const useAuth = (
  mode: "signin",
  body: { email?: string | null; password: string, username?: string | null }
) => {
    const {data, error,} = useSWR<User>(body.email || body.username && body.password ? '/signin': null, (url) =>fetcher(url, body)  )
    return {
      posts: data,
      loading: !data && !error,
      error: error,
    }
};