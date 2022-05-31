import fetcher from "@lib/fetcher";
import type { Post } from "@prisma/client";



export const createPost = (body: {plot: Post["plot"], title: Post["title"]}) =>  {
    return fetcher('posts/create', body)
}

export const editPost = (body: Post) =>  {
    return fetcher(`posts/edit`, body)
}