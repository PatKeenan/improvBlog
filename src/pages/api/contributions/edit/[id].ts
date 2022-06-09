import prisma from '@lib/prisma'
import { validateRoute } from '@lib/validateRoute'

export default validateRoute(async (req, res, user) => {
    
  const loggedInUser  = user
  const id = Number(req.query.id)
  try {
    const contribution = await prisma.contribution.findUnique({
      where: {
        id: id
      },
    })
    // Check to see if the signed in user can edit this post
    if (contribution && contribution.authorId !== loggedInUser.id) {
      res
        .status(401)
        .json({ contribution: null, error: true, message: 'You are not allowed to edit this contribution' })
      return
    }
    const updatedContribution = await prisma.contribution.update({
        where: {
            id: Number(id),
        },
        data: {...req.body}
    })
    
    if (updatedContribution) {
      res.status(200).json({ updatedContribution, error: false, message: null })
      return
    }

  } catch (error: any) {
    throw new Error(error)
  }
  res.status(401).json({error: 'You are not allowed to update this contribution'})
  return
})
