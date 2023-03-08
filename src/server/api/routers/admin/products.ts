import { type Prisma, USER_ROLE } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "../../trpc";

export const productsAdminRouter = createTRPCRouter({
  list: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.product.findMany();
  }),
  get: adminProcedure
    .input(
      z.object({
        page: z.number().int().default(0),
        perPage: z.number().int().default(10),
        name: z.string().optional(),
        sortBy: z.enum(["name", "published", "price", "createdAt"]).optional(),
        sortDesc: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const params: Prisma.ProductFindManyArgs = {
        orderBy: input.sortBy
          ? { [input.sortBy]: input.sortDesc ? "desc" : "asc" }
          : undefined,
        where: input.name ? { name: input.name } : undefined,
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
        price: z.number().min(0),
        published: z.boolean().default(true),
      })
    )
    .mutation(({ ctx, input }) => {
      const { name, price, published } = input;
      return ctx.prisma.product.create({
        data: {
          name,
          price,
          published,
          createdBy: ctx.session.user.email,
        },
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        price: z.number().min(0),
        published: z.boolean().default(true),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, name, price, published } = input;
      return ctx.prisma.product.update({
        where: { id },
        data: {
          name,
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
