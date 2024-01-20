import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
export const postReadlistRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        readListId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.postReadList.create({
        data: {
          post: {
            connect: {
              id: input.postId,
            },
          },
          readList: {
            connect: {
              id: input.readListId,
            },
          },
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        readListId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.postReadList.delete({
        where: {
          postId_readListId: {
            postId: input.postId,
            readListId: input.readListId,
          },
        },
      });
    }),

  deleteMany: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.postReadList.deleteMany({
        where: {
          readListId: input,
        },
      });
    }),
});
