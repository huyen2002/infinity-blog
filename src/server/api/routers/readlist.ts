import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
export const readlistRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.readList.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        posts: true,
      },
    });
  }),

  deleteOneWhereId: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // delete all postReadlist relations
      await ctx.prisma.postReadList.deleteMany({
        where: {
          readListId: input,
        },
      });
      // delete readlist
      return ctx.prisma.readList.delete({
        where: {
          id: input,
        },
      });
    }),

  create: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.readList.create({
      data: {
        name: input,
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  }),
});
