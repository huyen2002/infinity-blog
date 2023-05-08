import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: true,
      },
    });
  }),

  getAllWhereTopicId: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findMany({
        where: {
          topic: {
            id: input,
          },
        },
        include: {
          author: true,
        },
      });
    }),

  getOneWhereId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findUnique({
      where: {
        id: input,
      },
      include: {
        author: {
          include: {
            followedBy: true,
          },
        },
        readLists: true,
      },
    });
  }),

  getPostByUserId: publicProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.prisma.post.findMany({
      where: {
        authorId: input,
        // published: true,
      },
      include: {
        author: true,
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        content: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          title: input.title,
          description: input.description,
          content: input.content,
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  publish: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        content: z.string(),
        topic: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          title: input.title,
          description: input.description,
          content: input.content,
          published: true,
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          topic: {
            connectOrCreate: {
              where: {
                name: input.topic,
              },
              create: {
                name: input.topic,
              },
            },
          },
        },
      });
    }),

  deleteDraft: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.delete({
        where: {
          id: input,
        },
      });
    }),

  publishDraft: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        topic: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          published: true,
          topic: {
            connectOrCreate: {
              where: {
                name: input.topic,
              },
              create: {
                name: input.topic,
              },
            },
          },
        },
      });
    }),

  addToHistory: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // const { data: history } = api.history.get.useQuery();

      const history = await ctx.prisma.history.findUnique({
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

      const posts = history?.posts.map(({ post }) => post);
      const isPostInHistory = posts?.find((post) => post.id === input);

      if (isPostInHistory) return;
      return ctx.prisma.post.update({
        where: {
          id: input,
        },
        data: {
          histories: {
            create: {
              history: {
                connect: {
                  userId: ctx.session.user.id,
                },
              },
            },
          },
        },
      });
    }),

  removeFromHistory: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.update({
        where: {
          id: input,
        },
        data: {
          histories: {
            delete: {
              userId_postId: {
                postId: input,
                userId: ctx.session.user.id,
              },
            },
          },
        },
      });
    }),
});
