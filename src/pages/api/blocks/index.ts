import prisma from "@lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
 
    const user = await getSession({req})
    switch(req.method){
        case "POST": {
           
      if (!user) {
        return res.status(401).send({ error: true, message: 'Not authorized' });
      }
            const data = await createBlock(req.body.postId, user.user)
            return res.status(data?.status ?? 500).json(data?.data ?? null)
        }
        default: {
            return res.status(405).json({error: true, message: "Method not allowed"})
        }
    }
}

const createBlock = async (postId: number, user: any) => {
    // Make sure the user creating a block is the same as the author of the post
    try {
        const post = await prisma.post.findUnique({
            where: {
             id: postId
            },
            select: {
                authorId: true
            }
        })
        if(post && post.authorId !== user.id){
            return {
                status: 401,
                data: {error: true, message: "Not Authorized", block: null}
            }
        }
    } catch (error: any) {
        throw new Error(error)
    }
    // Create the block 
    try {
        const newBlock = await prisma.block.create({
            data: {
                postId: postId,    
            }
        })
        return {
            status: 200,
            data: {newBlock: newBlock, error: false, message: null}
        }
    } catch (error: any) {
        throw new Error(error)
    }
}