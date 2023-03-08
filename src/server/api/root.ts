import { createTRPCRouter } from "@/server/api/trpc";
import { adminRouter } from "./routers/admin";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  admin: adminRouter,
});


// export type definition of API
export type AppRouter = typeof appRouter;
