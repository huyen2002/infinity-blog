import { createTRPCRouter, protectedProcedure } from "../trpc";

const historyRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.history.findUnique({
      where: {
        userId: ctx.session.user.id,
      },

      include: {
        posts: {
          include: {
            post: true,
          },
        },
      },
    });
  }),
});

export default historyRouter;
