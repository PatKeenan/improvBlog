import prisma from "@lib/prisma";
import { validateToken } from "@lib/validateToken";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const {id} = req.query
    const token = req.cookies[process.env.JWT_TOKEN_NAME as unknown as string]

    switch(req.method){
        case "GET": {
            const data = await getContribution(Number(id))
            return res.status(data.status).json(data.data)
        }
        case "DELETE": {
            const user = validateToken(token)
            if(!user) return res.status(401).send({error: true, message: "Not authorized"})
            const data = await deleteContribution(Number(id), user)
            return res.status(data.status).json(data.data)
        }
        default: {
            return res
              .status(405)
              .json({ error: true, message: 'Method Not Allowed' });
          }
    }     
}

const deleteContribution = async (id: number, user: any) => {
    try {
        const contribution = await prisma.contribution.findUnique({
            where: {
              id: id
            },
          })
          if (contribution && contribution.authorId !== user.id) {
            return {
                status: 401,
                data: { post: null, error: true, message: 'You are not allowed to delete this contribution' }
            }
          }
    } catch (error: any) {
        throw new Error(error)
    }
    try {
        const deletedContribution = await prisma.contribution.delete({
            where: {
                id: Number(id),
            },
        })
        return {
            status: 200,
            data: deletedContribution
        }
    } catch (error) {
        throw new Error(error)
    }
}

const getContribution = async (id: number) => {
    try {
        const contribution = await prisma.contribution.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                author: {
                    select: {
                        username: true
                    }
                }
            }
        })
        return {
            status: 200,
            data: contribution
        }
        
    } catch (error: any) {
        throw new Error(error);
    }
}