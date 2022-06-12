import type { NextApiRequest, NextApiResponse } from "next";
import { contributionSchema } from "@lib/formValidations";
import { validateToken } from "@lib/validateToken";
import { Contribution } from "@prisma/client";
import prisma from "@lib/prisma";

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
        case "PATCH": {
            const user = validateToken(token)
            if(!user) return res.status(401).send({error: true, message: "Not authorized"})
            //Check to see if the incoming request is to update the content or like the contribution
            if(req.body.type == "updateContent"){
                delete req.body.type
                const data = await updateContribution(Number(id), user, req.body.content )
                return res.status(data.status).json(data.data)
            }
            //TODO: Add handler for liking contributions        
        }
        default: {
            return res
              .status(405)
              .json({ error: true, message: 'Method Not Allowed' });
          }
    }     
}
// TODO: Handle Liking contributions

const updateContribution = async (id: number, user: any, content: Contribution["content"]) => {
    // Validate the content
    try {
        await contributionSchema.validate({content: content}, { abortEarly: false });
    } catch (error: any) {
        return {
            status: 409,
            data: {updatedContribution: null, error}
        }
    }

    // Check to see if the user is allowed to update the contribution
    try {
        const targetContribution = await prisma.contribution.findUnique({where: {id: id}})   
        if(targetContribution && targetContribution.authorId !== user.id){
            return {
                status: 401,
                data: { updatedContribution: null, error: true, message: 'You are not allowed to update this contribution' }
            }
        }
    } catch (error: any) {
        throw new Error(error)
    }

    // Make the updates if is passes the allowed user check
    try {
        const updatedContribution = await prisma.contribution.update({
            where: {
                id: id
            },
            data: {content}
        })
        return {
            status: 200,
            data: {updatedContribution, error: false}
        }
    } catch (error: any) {
        throw new Error(error)
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
    } catch (error: any) {
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