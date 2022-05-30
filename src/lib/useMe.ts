import fetcher from "./fetcher";
import useSWR from "swr";

export const useMe = () => {
    const {data, error} = useSWR('/me', fetcher);
    return {
        user: data?.user ?? null,
        loading: !data && !error,
        error: error
    }
}