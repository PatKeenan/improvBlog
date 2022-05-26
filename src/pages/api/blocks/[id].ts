import prisma from "@lib-server/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const blockId = req.query.id;
    const block = await prisma.block.findUnique({
        where: {
            id: Number(blockId)
        },
        include: {
            contributions: {
                orderBy: {
                    likes: "desc"
                },
                include: {
                    author: {
                        select: {
                            username: true
                        }
                    }
                }
            }
        }
    })
    if(block){
       return  res.status(200).json(block)
    }
    return  res.status(404).json({ error: true, message: "Block not found" })
}