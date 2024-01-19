import type { Post } from "@prisma/client";
import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
export const postRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        page: z.number(),
        size: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [posts, count] = await ctx.prisma.$transaction([
        ctx.prisma.post.findMany({
          where: {
            published: true,
          },
          include: {
            author: true,
            topic: true,
            report: true,
          },
          skip: (input.page - 1) * input.size,
          take: input.size,
        }),
        ctx.prisma.post.count({
          where: {
            published: true,
          },
        }),
      ]);
      return {
        data: posts,
        total: count,
      };
    }),

  getAllWhereTopicId: publicProcedure
    .input(
      z.object({
        topicId: z.string(),
        params: z.object({
          page: z.number(),
          size: z.number(),
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input) {
        return {
          total: 0,
          data: [],
        };
      }

      const [posts, count] = await ctx.prisma.$transaction([
        ctx.prisma.post.findMany({
          where: {
            topic: {
              id: input.topicId,
            },
          },
          include: {
            author: true,
          },
          skip: (input.params.page - 1) * input.params.size,
          take: input.params.size,
        }),
        ctx.prisma.post.count({
          where: {
            topic: {
              id: input.topicId,
            },
          },
        }),
      ]);

      return {
        total: count,
        data: posts,
      };
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

  getPostByUserId: publicProcedure
    .input(
      z.object({
        id: z.string(),
        params: z.object({
          page: z.number(),
          size: z.number(),
        }),
      })
    )
    .query(async ({ input, ctx }) => {
      const [posts, count] = await ctx.prisma.$transaction([
        ctx.prisma.post.findMany({
          where: {
            authorId: input.id,
            published: true,
          },
          include: {
            author: true,
          },
          skip: (input.params.page - 1) * input.params.size,
          take: input.params.size,
        }),
        ctx.prisma.post.count({
          where: {
            authorId: input.id,
            published: true,
          },
        }),
      ]);
      return {
        data: posts,
        total: count,
      };
    }),

  getDraftByUserId: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        size: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const [drafts, count] = await ctx.prisma.$transaction([
        ctx.prisma.post.findMany({
          where: {
            authorId: ctx.session.user.id,
            published: false,
          },
          include: {
            author: true,
          },
          skip: (input.page - 1) * input.size,
          take: input.size,
        }),
        ctx.prisma.post.count({
          where: {
            authorId: ctx.session.user.id,
            published: true,
          },
        }),
      ]);
      return {
        data: drafts,
        total: count,
      };
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
        feature: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          title: input.title,
          description: input.description,
          content: input.content,
          published: true,
          feature: input.feature,
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

      const posts = history?.posts.map(({ post }: { post: Post }) => post);
      const isPostInHistory = posts?.find((post: Post) => {
        post.id === input;
      });

      if (isPostInHistory) return;
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input,
        },
      });
      if (post?.published === false) return;

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

  deleteOneWhereId: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.delete({
        where: {
          id: input,
        },
      });
    }),
});
