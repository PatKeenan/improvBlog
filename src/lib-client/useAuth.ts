import { User } from "@prisma/client";
import useSWR from "swr";
import fetcher from "./fetcher";

export const useAuth = (
  mode: "signin",
  body: { email: string; password: string }
) => {
    const {data, error,} = useSWR<User>('/signin', (url) =>fetcher(url, body)  )
    return {
      posts: data,
      loading: !data && !error,
      error: error,
    }
};