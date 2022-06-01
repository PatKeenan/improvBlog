import fetcher from "./fetcher";
import useSWR from "swr";

export const useMe = () => {
    const {data, error, mutate} = useSWR('/me', fetcher);
    return {
        user: data?.user ?? null,
        loading: !data && !error,
        error: error,
        mutate
    }
}