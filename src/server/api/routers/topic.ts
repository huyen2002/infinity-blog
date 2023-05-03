import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import z from "zod";
export const topicRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.topic.findMany();
  }),

  create: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.topic.create({
      data: {
        name: input,
      },
    });
  }),
});
