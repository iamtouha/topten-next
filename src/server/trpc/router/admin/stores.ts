import { type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, adminProcedure } from "../../trpc";

export const storesAdminRouter = router({
  get: adminProcedure
    .input(
      z.object({
        page: z.number().int().default(0),
        perPage: z.number().int().default(10),
        name: z.string().optional(),
        size: z.string().optional(),
        sortBy: z
          .enum(["name", "size", "published", "price", "createdAt"])
          .optional(),
        sortDesc: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const needFilter = input.size || input.name;

      const params: Prisma.ProductFindManyArgs = {
        orderBy: input.sortBy
          ? { [input.sortBy]: input.sortDesc ? "desc" : "asc" }
          : undefined,
        where: needFilter
          ? {
              AND: {
                name: input.name ? { contains: input.name } : undefined,
                size: input.size ? { contains: input.size } : undefined,
              },
            }
          : undefined,
      };

      const [count, products] = await ctx.prisma.$transaction([
        ctx.prisma.product.count({ where: params.where }),
        ctx.prisma.product.findMany({
          ...params,
          skip: input.page * input.perPage,
          take: input.perPage,
        }),
      ]);
      return { count, products };
    }),
  getOne: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.findUnique({
      where: { id: input },
      include: { stocks: true },
    });
    if (!product) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found!" });
    }
    return product;
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        address: z.string(),
        price: z.number().min(0),
        published: z.boolean().default(true),
      })
    )
    .mutation(({ ctx, input }) => {
      const { name, address, price, published } = input;
      return ctx.prisma.store.create({
        data: {
          name,
          address,
          published,
          createdBy: ctx.session.user.email,
        },
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        size: z.string(),
        price: z.number().min(0),
        published: z.boolean().default(true),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, name, size, price, published } = input;
      return ctx.prisma.product.update({
        where: { id },
        data: {
          name,
          size,
          price,
          published,
          updatedBy: ctx.session.user.email,
        },
      });
    }),

  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.product.delete({ where: { id: input } });
  }),
});
