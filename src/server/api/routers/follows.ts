import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
const followsRouter = createTRPCRouter({
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
});
export default followsRouter;
