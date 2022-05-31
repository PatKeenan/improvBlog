import fetcher from "@lib/fetcher";

import type { Block, Contribution, Post } from "@prisma/client";


export const auth = (
    mode: "signin" | 'signup',
    body: { email?: string | null; password: string, username?: string | null }
  ) => {
    return fetcher(mode, body)
  };

export const postMutations = () =>  {
    const baseApi = 'posts/';
    return {
        create: (body: {title: Post['title'], plot: Post['plot']}) => {
            return fetcher(baseApi + 'create', {...body, mode: 'create'})
        },
        edit: (body: {postId: Post['id']}) => {
            return fetcher(baseApi + 'edit', {...body, mode: 'edit'})
        },
        remove: (body: {postId: Post['id']}) => {
            return fetcher(baseApi + 'delete', {...body, mode: 'remove'})
        },
    }
}

export const blockMutations = () =>  {
    const baseApi = 'blocks/';
    return {
        create: (body: {postId: Post['id']}) => {
            return fetcher(baseApi + 'create', {...body, mode: 'create'})
        },
        remove: (body: {blockId: Block['id']}) => {
            return fetcher(baseApi + 'delete', {...body, mode: 'remove'})
        },
        toggleLock: (body: {blockId: Block["id"]}) => {
            return fetcher(baseApi + 'edit', {...body, mode: 'toggleLock'})
        }
    }
}

export const contributionMutations = () =>  {
    const baseApi = 'contributions/';
    return {
        create: (body: {blockId: Block['id']}) => {
            return fetcher(baseApi + 'create', {...body, mode: 'create'})
        },
        remove: (body: {contributionId: Contribution['id']}) => {
            return fetcher(baseApi + 'delete', {...body, mode: 'remove'})
        },
        toggleLike: (body: {contributionId: Contribution["id"]}) => {
            return fetcher(baseApi + 'edit', {...body, mode: 'toggleLike'})
        }
    }
}

