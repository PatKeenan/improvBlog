import { User } from "@prisma/client";
import { hasData } from "./hasData";
import fetcher from "./fetcher";
import useSWR from "swr";

export const useMe = () => {
    const {data, error, mutate} = useSWR<User>('/me', fetcher);
    return {
        user: hasData(data),
        loading: !data && !error,
        error: error,
        mutate
    }
}