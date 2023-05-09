import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
export const topicRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.topic.findMany({
      include: {
        post: true,
      },
    });
  }),

  create: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.topic.create({
      data: {
        name: input,
      },
    });
  }),
});
