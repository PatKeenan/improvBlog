import prisma from '@lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const contributionID = req.query.id
  const contribution = await prisma.contribution.findUnique({
    where: {
      id: Number(contributionID),
    },
  })
  if (contribution) {
    return res.status(200).json(contribution)
  }
  return res
    .status(404)
    .json({ error: true, message: 'cCntribution not found' })
}
