import { z } from "zod";
import {
  createTRPCContext,
  createTRPCRouter,
  protectedProcedure,
} from "../trpc";

const reactionRouter = createTRPCRouter({
  create: protectedProcedure.input(z.string()).mutation(({ input, ctx }) => {
    return ctx.prisma.reaction.create({
      data: {
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        post: {
          connect: {
            id: input,
          },
        },
      },
    });
  }),

  delete: protectedProcedure.input(z.string()).mutation(({ input, ctx }) => {
    return ctx.prisma.reaction.delete({
      where: {
        postId_userId: {
          postId: input,
          userId: ctx.session.user.id,
        },
      },
    });
  }),
});
export default reactionRouter;
