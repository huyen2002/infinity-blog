import { Status } from "@prisma/client";
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
    });
  }),

  getAll: adminProcedure
    .input(
      z.object({
        page: z.number(),
        size: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [users, count] = await ctx.prisma.$transaction([
        ctx.prisma.user.findMany({
          skip: (input.page - 1) * input.size,
          take: input.size,
        }),
        ctx.prisma.user.count(),
      ]);
      return {
        total: count,
        data: users,
      };
    }),

  getOneWhereId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: input,
      },
    });
  }),

  edit: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        bio: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          bio: input.bio,
        },
      });
    }),

  toggleActive: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          status: Status.ACTIVE,
        },
      });
    }),
});
