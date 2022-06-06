import type { Block, Contribution, Post } from "@prisma/client";
import { CreateEditContribution, EditablePostFields } from "@models";
import fetcher from "@lib/fetcher";



export const auth = (
    mode: "signin" | 'signup',
    body: { email?: string | null; password: string, username?: string | null }
  ) => {
    return fetcher(mode, body)
  };

export const logout = () => {
    return fetcher('/logout', {}, {method: "POST"})
}
 
export const postMutations = () =>  {
    const baseApi = 'posts/';
    return {
        create: (body: {title: Post['title'], plot: Post['plot']}) => {
            return fetcher(baseApi + 'create', body)
        },
        edit: (postId: Post['id'], body: EditablePostFields) => {
            return fetcher(baseApi + 'edit/' + postId, body)
        },
        remove: (body: {postId: Post['id']}) => {
            return fetcher(baseApi + 'delete/' + body.postId, body)
        },
    }
}

export const blockMutations = () =>  {
    const baseApi = 'blocks/';
    return {
        create: (body: {postId: Post['id']}) => {
            return fetcher(baseApi + 'create', body)
        },
        remove: (body: {blockId: Block['id']}) => {
            return fetcher(baseApi + 'delete', body)
        },
        toggleLock: (body: {blockId: Block["id"]}) => {
            return fetcher(baseApi + 'edit', body)
        }
    }
}

export const contributionMutations = () =>  {
    const baseApi = 'contributions/';
    return {
        create: (body: CreateEditContribution)=> {
            return fetcher(baseApi + 'create', body)
        },
        remove: (body: {contributionId: Contribution['id']}) => {
            return fetcher(baseApi + 'delete', body)
        },
        toggleLike: (body: {contributionId: Contribution["id"]}) => {
            return fetcher(baseApi + 'edit', body)
        }
    }
}

