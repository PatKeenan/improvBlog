import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@prisma/client";
import prisma from "./prisma";
import jwt from 'jsonwebtoken';
import { MakeOptional } from "./ts-utilities";
// eslint-disable-next-line no-unused-vars
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
       const userToReturn: MakeOptional<User, "password"> = {...user};
       delete userToReturn["password"]
       return handler(req, res, userToReturn)
      }
      return res.status(401).json({user: null, error: "Not authorized"})
    }
  }