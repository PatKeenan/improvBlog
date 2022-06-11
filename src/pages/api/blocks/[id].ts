import prisma from "@lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const blockId = req.query.id;
    const contributions = await prisma.contribution.findMany({
        where: {
            blockId: Number(blockId)
        },
        orderBy: [{
            likes: 'desc'
        }, {createdAt: "asc"}],
        include: {
            author: {
                select: {
                    username: true
                }
            }
        }
    })
    if(contributions){
       return  res.status(200).json(contributions)
    }
    return  res.status(404).json({ error: true, message: "Contributions not found" })
}