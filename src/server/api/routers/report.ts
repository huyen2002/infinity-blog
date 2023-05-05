import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const reportRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        userId: z.string(),
        reason: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.report.create({
        data: {
          post: {
            connect: {
              id: input.postId,
            },
          },
          user: {
            connect: {
              id: input.userId,
            },
          },
          reason: input.reason,
        },
      });
    }),
});
export default reportRouter;
