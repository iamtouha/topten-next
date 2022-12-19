import { router } from "../trpc";
import { adminRouter } from "./admin";
import { playgroundRouter } from "./playground";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  playground: playgroundRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
