import prisma from "@lib/prisma";
import { validateToken } from "@lib/validateToken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const token = req.cookies[process.env.JWT_TOKEN_NAME as unknown as string];
    
    switch(req.method){
        case "POST": {
            const user = validateToken(token);
      if (!user) {
        return res.status(401).send({ error: true, message: 'Not authorized' });
      }
            const data = await createBlock(req.body.postId, user)
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
            data: {block: newBlock, error: false, message: null}
        }
    } catch (error: any) {
        throw new Error(error)
    }
}