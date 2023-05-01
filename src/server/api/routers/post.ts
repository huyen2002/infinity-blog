import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      include: {
        author: true,
      },
    });
  }),

  getAllWhereTopicId: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findMany({
        where: {
          topic: {
            id: input,
          },
        },
        include: {
          author: true,
        },
      });
    }),

  getOneWhereId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findUnique({
      where: {
        id: input,
      },
      include: {
        author: {
          include: {
            followedBy: true,
          },
        },
      },
    });
  }),

  getPostPublishedByUserId: publicProcedure
    .input(z.string())
    .query(({ input, ctx }) => {
      return ctx.prisma.post.findMany({
        where: {
          authorId: input,
        },
        include: {
          author: true,
        },
      });
    }),
});
