import prisma from '@lib/prisma'
import { validateRoute } from '@lib/validateRoute'
import type { Post } from '@prisma/client'

export default validateRoute(async (req, res, user) => {
  const { loggedInUser } = user.user
  const { title, plot }: { title: Post['title']; plot: Post['plot'] } = req.body

  try {
    const titleIsAlreadyUsed = await prisma.post.findUnique({
      where: {
        title: title,
      },
    })
    // Check to see if the title is already in use
    if (titleIsAlreadyUsed) {
      res
        .status(200)
        .json({ post: null, error: true, message: 'Title is already taken' })
      return
    }

    // Create a slug for the post
    const slugifedTitle = String(title).trim().replace(/\s\s+/g, '-')

    const post = await prisma.post.create({
      data: {
        author: {
          connect: {
            id: user.user.id,
          },
        },
        plot: plot,
        title: title,
        slug: slugifedTitle,
      },
    })
    if (post) {
      res.status(200).json({ post: post, error: false, message: null })
      return
    }
  } catch (error: any) {
    throw new Error(error)
  }

  res.status(401)
  return
})
