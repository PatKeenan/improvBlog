import { postPlotTitleSchema } from "@lib/formValidations";
import { TRPCError } from "@trpc/server";
import { createRouter } from "server/createRouter";
import * as yup from 'yup'

export interface PostByIDInput {
  title: string;
  plot: string ;
}

export const postsRouter = createRouter()
/////////////////////////////////////////////////
.middleware(async ({ meta, next, ctx }) => {
  // only check authorization if enabled
  if (meta?.hasAuth && !ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You're not allowed to Do this sucker!" });
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
.query('byId', {
  input: yup.object({
    post_uuid: yup.string().required()
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
     /*  if(!ctx.session || !ctx.session?.user){
        throw new TRPCError({
          code: "FORBIDDEN"
        })
      } */
        const {id} = ctx.session.user
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