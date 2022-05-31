import fetcher from '@lib/fetcher';

export const auth = (
  mode: "signin" | 'signup',
  body: { email?: string | null; password: string, username?: string | null }
) => {
  return fetcher(mode, body)
};
