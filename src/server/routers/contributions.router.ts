import { contributionSchema } from "@lib/formValidations";
import { createRouter } from "server/createRouter";
import { TRPCError } from "@trpc/server";
import {z} from 'zod'

export const contributionRouter = createRouter()
.middleware(async ({ meta, next, ctx }) => {
    // only check authorization if enabled
    if (meta?.hasAuth && !ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "You need to sign in to perform this action" });
    }
    return next()
  })
.query('byBlock', {
    input: z.object({
        blockId: z.number(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
    }),
    async resolve({ctx, input}){
        const limit = input.limit ?? 6
        const {cursor, blockId} = input
        const contributions = await ctx.prisma.contribution.findMany({
            where: {
                blockId: blockId,
            },
            take: limit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: [
                {likes: {
                    _count: 'desc'
                }},
                {createdAt: 'asc'}
            ],
            include: {
                author: {
                    select: {
                        name: true
                    }
                },
                likes: true,
                _count: {
                    select: {
                        likes: true
                    }
                }   
            }
        })
        let nextCursor: typeof cursor | null = null;
        if(contributions.length > limit){
            const nextItem = contributions.pop()
            nextCursor = nextItem!.id
        }
        return {
            contributions,
            nextCursor
        }
    }
})
.mutation('create', {
    input: z.object({
        blockId: z.number(),
        content: z.string(),
        postId: z.number()
    }),
    meta: {
        hasAuth: true
    },
    async resolve({ctx, input}){
        if(!ctx.session?.user){
            throw new TRPCError({
                code: "FORBIDDEN"
              })
        }
        return await ctx.prisma.contribution.create({
            data: {
                postId: input.postId,
                blockId: input.blockId,
                content: input.content,
                authorId: ctx.session.user.id as number
            }
        })

    }
})
.mutation('update', {
    input: contributionSchema.extend({id: z.number()}),
    meta: {
        hasAuth: true
    },
    async resolve({ctx, input}){
         // Make sure user is allowed to delete this contribution
        const targetContrib = await ctx.prisma.contribution.findUnique({
            where: {
                id: input.id
            }
        })
        if(targetContrib && targetContrib.authorId !== ctx.session?.user.id){
            throw new TRPCError({
                code: "FORBIDDEN"
            })
        }else {
            return await ctx.prisma.contribution.update({
                where: {
                    id: input.id
                },
                data: {
                    content: input.content
                }
            })
        }
    }
})
.mutation('delete', {
    input: z.object({
        id: z.number()
    }),
    meta: {
        hasAuth: true
    },
    async resolve({ctx, input}){
        // Make sure user is allowed to delete this contribution
        const targetContrib = await ctx.prisma.contribution.findUnique({
            where: {
                id: input.id
            }
        })
        if(targetContrib && targetContrib.authorId !== ctx.session?.user.id){
            throw new TRPCError({
                code: "FORBIDDEN"
            })
        }else{
            return await ctx.prisma.contribution.delete({
                where: {
                    id: input.id
                }
            })
        }
    }
})
.mutation('like', {
    input: z.object({
        postId: z.number(),
        blockId: z.number(),
        contributionId: z.number()
    }),
    meta: {
        hasAuth: true
    },
    async resolve({ctx, input}){
        return await ctx.prisma.like.create({
            data: {
                contribution: {
                    connect:{
                        id: input.contributionId
                    }
                },
                block: {
                    connect: {
                        id: input.blockId
                    }
                },
                post: {
                    connect: {
                        id: input.postId
                    }
                },
                user: {
                    connect: {
                        id: ctx.session!.user.id
                    }
                }
            }
        })
    }
})
.mutation('unlike', {
    input: z.object({
        likedID: z.number()
    }),
    meta: {
        hasAuth: true
    },
    async resolve({ctx, input}){
        const target = await ctx.prisma.like.findUnique({
            where:{
                id: input.likedID
            }
        })
        if( target?.likerId !== ctx.session?.user.id){
            throw new TRPCError({
                code: "FORBIDDEN"
            })
        }
        return await ctx.prisma.like.delete({
            where: {
                id: input.likedID
            }
        })
    }
})