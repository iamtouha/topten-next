import { router } from "../trpc";
import { adminRouter } from "./admin";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
