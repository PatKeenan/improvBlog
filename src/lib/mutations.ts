import type { Block, Contribution, Post } from "@prisma/client";
import { CreateEditContribution, EditablePostFields } from "@models";
import fetcher from "@lib/fetcher";



export const auth = (
    mode: "signin" | 'signup',
    body: { email?: string | null; password: string, username?: string | null }
  ) => {
    return fetcher(mode, body, "POST")
  };

export const logout = () => {
    return fetcher('/logout', {}, "POST")
}
 
export const postMutations = () =>  {
    const baseApi = 'posts/';
    return {
        create: (body: {title: Post['title'], plot: Post['plot']}) => {
            return fetcher(baseApi, body, "POST")
        },
        edit: (postId: Post['id'], body: EditablePostFields) => {
            return fetcher(baseApi + 'edit/' + postId, body, "POST")
        },
        remove: (post_uuid: string) => {
            return fetcher(baseApi + `/${post_uuid}`, {}, "DELETE")
        },
    }
}

export const blockMutations = () =>  {
    const baseApi = 'blocks/';
    return {
        create: (body: {postId: Post['id']}) => {
            return fetcher(baseApi + 'create', body, "POST")
        },
        remove: (body: {blockId: Block['id']}) => {
            return fetcher(baseApi + 'delete', body, "DELETE")
        },
        toggleLock: (body: {blockId: Block["id"]}) => {
            return fetcher(baseApi + 'edit', body, "POST")
        }
    }
}

export const contributionMutations = () =>  {
    const baseApi = 'contributions/';
    return {
        create: (body: CreateEditContribution)=> {
            return fetcher(baseApi, body, "POST")
        },
        remove: (body: {contributionId: Contribution['id']}) => {
            return fetcher(baseApi + 'delete/' + body.contributionId, body, "DELETE")
        },
        edit: (body: {contributionId: Contribution['id'] | null, content: Contribution['content']}) => {
            return fetcher(body.contributionId ? baseApi + `edit/${body.contributionId}` : null, {content: body.content})
        },
        toggleLike: (body: {contributionId: Contribution["id"]}) => {
            return fetcher(baseApi + 'edit', body)
        }
    }
}


