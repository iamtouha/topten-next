import { createTRPCRouter } from "../../trpc";
import { usersAdminRouter } from "./users";
import { productsAdminRouter } from "./products";
import { storesAdminRouter } from "./stores";

export const adminRouter = createTRPCRouter({
  users: usersAdminRouter,
  products: productsAdminRouter,
  stores: storesAdminRouter,
});
