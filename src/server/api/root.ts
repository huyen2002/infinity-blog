import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { postRouter } from "./routers/post";
import { postReadlistRouter } from "./routers/postReadlist";
import { readlistRouter } from "./routers/readlist";
import { topicRouter } from "./routers/topic";
import followsRouter from "./routers/follows";
import reportRouter from "./routers/report";
import reactionRouter from "./routers/reaction";
import historyRouter from "./routers/history";
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
  follows: followsRouter,
  report: reportRouter,
  reaction: reactionRouter,
  history: historyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
