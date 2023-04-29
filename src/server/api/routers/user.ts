import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        followedBy: true,
        following: true,
      },
    });
  }),

  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  getOneWhereId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: input,
      },
      // include: {
      //   readList: true,
      //   followedBy: true,
      //   following: true,
      // },
    });
  }),
});
