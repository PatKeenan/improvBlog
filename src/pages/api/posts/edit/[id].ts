import prisma from '@lib/prisma'
import { validateRoute } from '@lib/validateRoute'

export default validateRoute(async (req, res, user) => {
    
  const loggedInUser  = user.user
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
        .json({ post: null, error: true, message: 'You are not allowed to edit this post' })
      return
    }
    const updatedPost = await prisma.post.update({
        where: {
            id: Number(id),
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
  res.status(401).json({error: 'You are not allowed to update this post'})
  return
})
