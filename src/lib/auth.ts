import fetcher from "./fetcher";

export const useAuth = (
  mode: "signin" | 'signup',
  body: { email?: string | null; password: string, username?: string | null }
) => {
  return fetcher(mode, body)
};
