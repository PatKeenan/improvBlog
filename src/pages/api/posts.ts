// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '@lib-server/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) { 
      const data =  await prisma.post.findMany({include: {
        author: true,
        _count : {
          select: {blocks: true, contributions:true }
        }
      }})
        if(data){
            res.status(200).json(data);
        }else{
            res.status(404);
            res.json({message: "An error has occurred "})
        }
}
