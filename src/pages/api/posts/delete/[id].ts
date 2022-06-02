import prisma from '@lib/prisma'
import { validateRoute } from '@lib/validateRoute'

export default validateRoute(async (req, res, user) => {
    
  const loggedInUser  = user
  const id = Number(req.query.id)
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id
      },
    })
    // Check to see if the signed in user can edit this post
    if (post && post.authorId !== loggedInUser.id) {
      res
        .status(401)
        .json({ post: null, error: true, message: 'You are not allowed to delete this post check 1' })
      return
    }

    const updatedPost = await prisma.post.delete({
        where: {
            id: Number(id),
        },
    })
    
    if (updatedPost) {
      res.status(200).json({ updatedPost: updatedPost, error: false, message: null })
      return
    }

  } catch (error: any) {
    throw new Error(error)
  }
  res.status(401).json({error: 'You are not allowed to delete this post check 2'})
  return
})
