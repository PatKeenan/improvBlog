// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '@lib-server/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) { 
    const post_uuid = req.body

    if(post_uuid){
        const data =  await prisma.post.findUnique({
            where: {
                post_uuid: req.body,
            }
        })
          if(data){
              res.status(200).json(data);
          }else{
              res.status(404);
              res.json({message: `Post ${post_uuid} not found`})
          }
    }else {
        res.status(404);
        res.json({message: 'An error has occurred'})
    }
      
}
