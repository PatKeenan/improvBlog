import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken'
import prisma from "./prisma";
import { User } from "@prisma/client";
export const validateRoute = (handler: { (req: NextApiRequest, res: NextApiResponse, user: any): any; (arg0: NextApiRequest, arg1: NextApiResponse<any>, arg2: User): any; }) => {
    return async (req: NextApiRequest, res: NextApiResponse)  => {
      const token = req.cookies[process.env.JWT_TOKEN_NAME as unknown as string]
      if(token){
        let user;
       try {
         const {id} = jwt.verify(token, process.env.JWT_SECRET as unknown as string) as {id: number};
         
         user = await prisma.user.findUnique({
           where: {
             id: id
           }
         })
         if(!user){
           throw new Error('Not real user')
         }
       } catch (error) {
        return res.status(401).json({user: null, error: "Not authorized"})
       }
       const userToReturn: Omit<User, "password" | "createdAt"> = {username: user.username, id: user.id, user_uuid: user.user_uuid, role: user.role,email: user.email } 
       return handler(req, res, {user: userToReturn, error: null})
      }
      return res.status(401).json({user: null, error: "Not authorized"})
    }
  }