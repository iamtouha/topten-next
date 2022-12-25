import { router } from "../../trpc";
import { usersAdminRouter } from "./users";
import { productsAdminRouter } from "./products";
import { storesAdminRouter } from "./stores";

export const adminRouter = router({
  users: usersAdminRouter,
  products: productsAdminRouter,
  stores: storesAdminRouter,
});
