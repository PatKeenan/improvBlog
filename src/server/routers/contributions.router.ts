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
        blockId: z.number()
    }),
    resolve({ctx, input}){
        return ctx.prisma.contribution.findMany({
            where: {
                blockId: input.blockId
            },
            orderBy: [
                {likes: 'desc'}, 
                {createdAt: "asc"}
            ],
            include: {
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })
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