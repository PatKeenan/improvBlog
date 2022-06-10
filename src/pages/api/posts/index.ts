import { postPlotTitleSchema } from '@lib/formValidations';
import { NextApiRequest, NextApiResponse } from 'next';
import { validateToken } from '@lib/validateToken';
import { Post } from '@prisma/client';
import prisma from '@lib/prisma'


export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const token = req.cookies[process.env.JWT_TOKEN_NAME as unknown as string]
    
    
  
    switch(req.method){
        case "GET":{
            const data = await getPosts();
            return res.status(data.status).json(data.data)
        }
        case "POST": {
            const user = validateToken(token)
            if(!user) return res.status(401).send({error: true, message: "Not authorized"})
            const data = await createPost(req, user)
            return res.status(data?.status ?? 500).json(data?.data ?? null)
        }
        default: {
            return res.status(405).json({error: true, message: "Method Not Allowed"})
        }
    }
}

const getPosts = async () => {
  try {
    const data =  await prisma.post.findMany({orderBy: {createdAt: 'desc'}, include: {
      author: {
        select: {username: true}
      },
      _count : {
        select: {blocks: true, contributions: true }
      },
    }})
    return {
      status: 200,
      data: data
    };
  } catch (error: any) {
    throw Error(error)
  }
}


// Extracted the createPost function so it' easier to follow
async function createPost(req: NextApiRequest, user:any): Promise<{status: number, data: any} | undefined>  {
  try {
    await postPlotTitleSchema.validate(req.body, { abortEarly: false });
  } catch (error: any) {
    return {
      status: 409,
      data: error
    };
  }
  const { title, plot }: { title: Post['title']; plot: Post['plot'] } =
    req.body;
  try {
    const titleIsAlreadyUsed = await prisma.post.findUnique({
      where: {
        title: title,
      },
    });
    // Check to see if the title is already in use
    if (titleIsAlreadyUsed) {
      return{
        status: 200,
        data: { error: true, message: 'Title is already taken' }
      };
    }
    // Create a slug for the post
    const post = await prisma.post.create({
      data: {
        author: {
          connect: {
            id: user.id,
          },
        },
        plot: plot,
        title: title,
        slug: '',
        blocks: {
          create: {},
        },
      },
    });
    if (post) {
      return {
        status: 200,
        data: { post: post, error: false, message: null }
      };
    }
  } catch (error: any) {
    throw new Error(error);
  }
}