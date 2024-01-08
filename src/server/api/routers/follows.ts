import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
const followsRouter = createTRPCRouter({
  getFollowersByUserId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        params: z.object({
          page: z.number(),
          size: z.number(),
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      const [users, count] = await ctx.prisma.$transaction([
        ctx.prisma.follows.findMany({
          where: {
            followingId: input.id,
          },
          include: {
            follower: true,
          },
          skip: (input.params.page - 1) * input.params.size,
          take: input.params.size,
        }),
        ctx.prisma.follows.count({
          where: {
            followingId: input.id,
          },
        }),
      ]);

      return {
        total: count,
        data: users,
      };
    }),

  getFollowingsByUserId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        params: z.object({
          page: z.number(),
          size: z.number(),
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      const [users, count] = await ctx.prisma.$transaction([
        ctx.prisma.follows.findMany({
          where: {
            followerId: input.id,
          },
          include: {
            following: true,
          },
          skip: (input.params.page - 1) * input.params.size,
          take: input.params.size,
        }),
        ctx.prisma.follows.count({
          where: {
            followerId: input.id,
          },
        }),
      ]);
      return {
        total: count,
        data: users,
      };
    }),
  create: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.follows.create({
      data: {
        followerId: ctx.session.user.id,
        followingId: input,
      },
    });
  }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: ctx.session.user.id,
          followingId: input,
        },
      },
    });
  }),
  block: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: input,
          followingId: ctx.session.user.id,
        },
      },
    });
  }),
});
export default followsRouter;
