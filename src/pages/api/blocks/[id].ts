import prisma from "@lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const {id} = req.query
    switch(req.method){
        case "GET": {
            const data = await getBlockContributions(Number(id))
            return res.status(data.status).json(data.data)
        }
        default: {
            return res
              .status(405)
              .json({ error: true, message: 'Method Not Allowed' });
          }
    }     
}


const getBlockContributions = async (blockId: number) => {
    try {
        const block = await prisma.block.findUnique({
            where: {
                id: Number(blockId)
            },
            select: {
                contributions: {
                    orderBy: [ {createdAt: "asc"}],
                    include: {
                        author: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
        return {
            status: 200,
            data: block?.contributions
        }
        
    } catch (error: any) {
        throw new Error(error);
    }
}