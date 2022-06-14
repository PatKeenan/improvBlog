import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { User } from "@prisma/client";
import prisma from "./prisma";

// eslint-disable-next-line no-unused-vars
export const validateRoute = (handler: { (req: NextApiRequest, res: NextApiResponse, user: any): any; (arg0: NextApiRequest, arg1: NextApiResponse<any>, arg2: User): any; }) => {
    return async (req: NextApiRequest, res: NextApiResponse)  => {
      /* const token = req.cookies[process.env.JWT_TOKEN_NAME as unknown as string] */
      const session = await getSession({req})
      if(session && session.user?.email){
        let user;
       try {
         user = await prisma.user.findUnique({
           where: {
             email: session.user?.email
           }
         })
         if(!user){
           throw new Error('Not real user')
         } 
       } catch (error) {
        return res.status(401).json({user: null, error: "Not authorized"})
       }
       const userToReturn: User = {...user};
       return handler(req, res, userToReturn)
      }
      return res.status(401).json({user: null, error: "Not authorized"})
    }
  }