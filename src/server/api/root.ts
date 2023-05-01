import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { postRouter } from "./routers/post";
import { postReadlistRouter } from "./routers/postReadlist";
import { readlistRouter } from "./routers/readlist";
import { topicRouter } from "./routers/topic";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  topic: topicRouter,
  post: postRouter,
  readlist: readlistRouter,
  postReadlist: postReadlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
