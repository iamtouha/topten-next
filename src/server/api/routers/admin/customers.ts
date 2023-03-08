import { type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "../../trpc";

export const customersAdminRouter = createTRPCRouter({
  get: adminProcedure
    .input(
      z.object({
        page: z.number().int().default(0),
        perPage: z.number().int().default(10),
        name: z.string().optional(),
        phone: z.string().optional(),
        store: z.string().optional(),
        sortBy: z.enum(["name", "phone", "createdAt"]).optional(),
        sortDesc: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const needFilter = input.store || input.name;

      const params: Prisma.CustomerFindManyArgs = {
        orderBy: input.sortBy
          ? { [input.sortBy]: input.sortDesc ? "desc" : "asc" }
          : undefined,
        where: needFilter
          ? {
              name: input.name ? { contains: input.name } : undefined,
              store: input.store
                ? { name: { contains: input.store } }
                : undefined,
            }
          : undefined,
      };

      const [count, customers] = await ctx.prisma.$transaction([
        ctx.prisma.customer.count({ where: params.where }),
        ctx.prisma.customer.findMany({
          ...params,
          skip: input.page * input.perPage,
          take: input.perPage,
        }),
      ]);
      return { count, customers };
    }),
  getOne: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const customer = await ctx.prisma.customer.findUnique({
      where: { id: input },
    });
    if (!customer) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found!" });
    }
    return customer;
  }),
});
