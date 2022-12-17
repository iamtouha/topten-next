import { router } from "../../trpc";
import { usersAdminRouter } from "./users";

export const adminRouter = router({
  users: usersAdminRouter,
});
