/**
 * 
 * All The logic from this file is used in the usePost hook. 
 * 
 */
import { postPlotTitleSchema } from "@lib/formValidations";
import { TRPCError } from "@trpc/server";
import { createRouter } from "server/createRouter";
import {string, z} from 'zod'


export const postsRouter = createRouter()
/////////////////////////////////////////////////
.middleware(async ({ meta, next, ctx }) => {
  // only check authorization if enabled
  if (meta?.hasAuth && !ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You need to sign in to perform this action" });
  }
  return next()
})
.query('all', {
  async resolve({ctx}){
    return ctx.prisma.post.findMany({orderBy: {createdAt: 'desc'}, include: {
      author: {
        select: {name: true}
      },
      _count : {
        select: {blocks: true, contributions: true }
      },
    }})
    
  }
})
/////////////////////////////////////////////////
.query('single', {
  input: z.object({
    post_uuid: z.string().min(6)
  }),
  async resolve({ctx, input}){
    return await ctx.prisma.post.findUnique({
      where: {
        post_uuid: input.post_uuid,
      },
      include: {
          author: {
              select: {
                  name: true
              }
          },
          blocks: {
              orderBy: {
              createdAt: 'asc'  
              },
              include: {
                  _count:{
                      select: {
                          contributions: true
                      }
                  },
                  contributions: {
                      take: 1,
                      orderBy: [
                          {likes: 'desc'}, 
                          {createdAt: "asc"}
                      ],
                      include: {
                          author: {select: {name: true}}
                      },           
                  }
              }
          }
      }
    })
  }
})
/////////////////////////////////////////////////
.mutation('create', {
    input: postPlotTitleSchema,
    meta: {
      hasAuth: true
    },
    async resolve({ctx, input}){
        const {id} = ctx.session!.user
        return ctx.prisma.post.create({
        data: {
          slug: '',
          blocks: {
            create: {}
          },
          plot: input.plot,
          title: input.title,
          author: {
            connect: {
              id: id
            }
          }
        }
      })
    }
  }
)
////////////////////////////////////////////////
.mutation('update', {
  input: postPlotTitleSchema.extend({
    post_uuid: string()
  }),
  meta: {
    hasAuth: true,
  },
  async resolve({ctx, input}){
    const content: Partial<typeof input> = {...input}
    const {post_uuid} = content as Partial<typeof input> ;
    delete content['post_uuid']
    
    const targetPost = await ctx.prisma.post.findUnique({
      where: {
        post_uuid: post_uuid
      }
    })
    if(!targetPost || targetPost.authorId !== ctx.session?.user.id){
      throw new TRPCError({
        code: "FORBIDDEN"
      })
    }
    return await ctx.prisma.post.update({
      where: {
        post_uuid: post_uuid
      },
      data: {
        ...content
      }
    })
  
  }
})
/////////////////////////////////////////////////
.mutation('deleteById', {
  input: z.object({
    post_uuid: z.string()
  }),
  meta: {
    hasAuth: true
  },
  async resolve({ctx, input}){
    const targetPost = await ctx.prisma.post.findUnique({
      where: {
        post_uuid: input.post_uuid
      }
    })
    if(targetPost?.authorId !== ctx.session?.user.id){
      throw new TRPCError({
        code: "FORBIDDEN"
      })
    }else {
      return await ctx.prisma.post.delete({
        where: {
          post_uuid: input.post_uuid
        }
      })
    }
  }
})