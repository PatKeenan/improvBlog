// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '@lib-server/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) { 
      const profile = prisma.profile.findUnique({
          where: {
              id: req.body.id
          }
      })
        if(profile){
            res.status(200).json(profile);
        }else{
            res.status(404);
            res.json({message: "An error has occurred "})
        }
}
