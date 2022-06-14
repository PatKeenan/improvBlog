import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const {id} = req.query 
    switch(req.method){
        case "GET": {
            const data = await getContributionsByBlock(Number(id))
            return res.status(data.status).json(data.data)
        }
        default: {
            return res
              .status(405)
              .json({ error: true, message: 'Method Not Allowed' });
          }
    }     
}


const getContributionsByBlock = async (blockId: number) => {
    try {
        const contributions = await prisma.contribution.findMany({
            where: {
                blockId: Number(blockId)
            },
            orderBy: [
                {likes: 'desc'}, 
                {createdAt: "asc"}
            ],
            include: {
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return {
            status: 200,
            data: contributions
        }
        
    } catch (error: any) {
        throw new Error(error);
    }
}