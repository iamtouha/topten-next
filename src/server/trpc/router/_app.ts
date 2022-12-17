import { router } from "../trpc";
import { usersAdminRouter } from "./admin/users";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  users: usersAdminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
