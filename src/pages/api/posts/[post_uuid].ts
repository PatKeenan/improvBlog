// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import { validateToken } from '@lib/validateToken'
import { Post } from '@prisma/client'
import prisma from '@lib/prisma'


export default async function handler(req: NextApiRequest, res: NextApiResponse){ 
    const {post_uuid }= req.query as unknown as { post_uuid: Post["post_uuid"]} 

    const token = req.cookies[process.env.JWT_TOKEN_NAME as unknown as string]

    switch(req.method){
        case "GET":{
            const data = await getPost(post_uuid);
            return res.status(data.status).json(data.data)
        }
        case "PATCH": {
            const user = validateToken(token)
            if(!user) return res.status(401).send({error: true, message: "Not authorized"})
            const data = await editPost(req.body, user.id, post_uuid)
            return res.status(data?.status ?? 500 ).json(data?.data ?? null)
        }
        case "DELETE": {
            const user = validateToken(token)
            if(!user) return res.status(401).send({error: true, message: "Not authorized"})
            const data = await deletePost(user.id, post_uuid)
            return res.status(data?.status).json(data?.data)
        }
        default: {
            return res.status(405).json({error: true, message: "Method Not Allowed"})
        }
    }
}

const getPost = async (post_uuid: string) => {
    try {
        const data = await prisma.post.findUnique({
            where: {
                post_uuid: post_uuid,
            },
            include: {
                author: {
                    select: {
                        username: true
                    }
                },
                blocks: {
                    orderBy: {
                    createdAt: 'asc'  
                    },
                    include: {
                        _count:{
                            select: {
                                contributions: true
                            }
                        },
                        contributions: {
                            take: 1,
                            orderBy: {
                                likes: 'desc'
                            },
                            include: {
                                author: {select: {username: true}}
                            },
                            
                        }
                    }
                }
            }
        })  
        return {
            status: 200,
            data: data ? data : {error: true, message: "Post not found"}
        }
    } catch (error: any) {
        throw Error(error)
    }
}


const editPost = async (requestBody: NextApiRequest["body"], userId: number, post_uuid: Post['post_uuid']) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        post_uuid: post_uuid
      },
    })
    // Check to see if the signed in user can edit this post
    if (post && post.authorId !== userId) {
      return {
          status: 401,
          data: { post: null, error: true, message: 'You are not allowed to edit this post' }
      }
    }
    const updatedPost = await prisma.post.update({
        where: {
            post_uuid: post_uuid,
        },
        data: {...requestBody}
    })
    
    if (updatedPost) {
      return {
          status: 200,
          data: { updatedPost: updatedPost, error: false, message: null }
      }
    }

  } catch (error: any) {
    throw new Error(error)
  }
}


const deletePost = async (userId: number, post_uuid: Post['post_uuid']) =>{
   try {
        const post = await prisma.post.findUnique({
        where: {
          post_uuid: post_uuid
        },
      })
      if(post?.authorId !== userId){
          return {status: 403, data: {error: true, message: 'Not Authorized'}}
      }
   } catch (error: any) {
    throw new Error(error)
   }
   try {
    await prisma.post.delete({
        where: {
            post_uuid: post_uuid,
        },
    })
    return {status: 200, data: {error: false, deletedPost: true}}
   } catch (error: any) {
    throw new Error(error)
   }
}