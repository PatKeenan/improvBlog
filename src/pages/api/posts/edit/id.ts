import prisma from '@lib/prisma'
import { validateRoute } from '@lib/validateRoute'
import type { Post } from '@prisma/client'

export default validateRoute(async (req, res, user) => {
    
  const { loggedInUser } = user.user

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.body.id
      },
    })
    // Check to see if the signed in user can edit this post
    if (post && post.authorId !== loggedInUser.id) {
      res
        .status(401)
        .json({ post: null, error: true, message: 'You are not allowed to edit this post' })
      return
    }

    const updatedPost = await prisma.post.update({
        where: {
            id: req.body.id,
        },
        data: {...req.body}
    })
    
    if (updatedPost) {
      res.status(200).json({ updatedPost: updatedPost, error: false, message: null })
      return
    }
  } catch (error: any) {
    throw new Error(error)
  }
  res.status(401)
  return
})
