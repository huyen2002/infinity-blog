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
      include: {
        followedBy: {
          include: {
            follower: true,
          },
        },
        following: {
          include: {
            following: true,
          },
        },
      },
    });
  }),

  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      include: {
        post: true,
      },
    });
  }),

  getOneWhereId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: input,
      },
      include: {
        post: true,
        followedBy: {
          include: {
            follower: true,
          },
        },
        following: {
          include: {
            following: true,
          },
        },
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
