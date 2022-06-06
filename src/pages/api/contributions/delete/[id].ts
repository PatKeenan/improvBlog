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
        .json({ post: null, error: true, message: 'You are not allowed to delete this contribution' })
      return
    }

    const deletedContribution = await prisma.contribution.delete({
        where: {
            id: Number(id),
        },
    })
    
    if (deletedContribution) {
      res.status(200).json({ deletedContribution: deletedContribution, error: false, message: null })
      return
    }

  } catch (error: any) {
    throw new Error(error)
  }
  res.status(401).json({error: 'You are not allowed to delete this contribution'})
  return
})
