// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '@lib-server/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) { 
    try {
        const {post_uuid} = req.query as unknown as {post_uuid: string}
        const data =  await prisma.post.findUnique({
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
        if(data){
            return res.status(200).json(data);
        }
        
        return res.status(404).json( {message: `Post ${post_uuid} not found`})
        
    } catch (error) {
        return  res.status(500).json( {message: `An error has occurred`})
    }
    
}
