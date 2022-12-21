import { router } from "../../trpc";
import { usersAdminRouter } from "./users";
import { productsAdminRouter } from "./products";

export const adminRouter = router({
  users: usersAdminRouter,
  products: productsAdminRouter,
});
