import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@lib/prisma'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) { 
  try {
    const data =  await prisma.post.findMany({orderBy: {createdAt: 'desc'}, include: {
      author: {
        select: {username: true}
      },
      _count : {
        select: {blocks: true, contributions: true }
      },
    }})
    return res.status(200).json(data);
  } catch (error: any) {
    throw Error(error)
  }
}
