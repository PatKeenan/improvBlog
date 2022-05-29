import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken'
import prisma from "./prisma";
import { User } from "@prisma/client";
export const validateRoute = (handler: { (req: NextApiRequest, res: NextApiResponse, user: any): any; (arg0: NextApiRequest, arg1: NextApiResponse<any>, arg2: User): any; }) => {
    const tokenEnv = process.env.JWT_TOKEN_NAME as unknown as string 
    return async (req: NextApiRequest, res: NextApiResponse)  => {
      const token = req.cookies.tokenEnv
      if(token){
        let user;
       try {
         const {id} = jwt.verify(token, tokenEnv) as {id: number};
         user = await prisma.user.findUnique({
           where: {
             id: id
           }
         })
         if(!user){
           throw new Error('Not real user')
         }
       } catch (error) {
        return res.status(401).json({error: "Not authorized"})
       }
  
       return handler(req,res,user)
      }
      return res.status(401).json({error: "Not authorized"})
    }
  }