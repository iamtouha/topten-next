import { ROLE_TYPE, type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, adminProcedure } from "../../trpc";

export const storesAdminRouter = router({
  list: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.store.findMany();
  }),
  get: adminProcedure
    .input(
      z.object({
        page: z.number().int().default(0),
        perPage: z.number().int().default(10),
        name: z.string().optional(),
        sortBy: z.enum(["name", "published", "createdAt"]).optional(),
        sortDesc: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const needFilter = input.name;
      const params: Prisma.StoreFindManyArgs = {
        orderBy: input.sortBy
          ? { [input.sortBy]: input.sortDesc ? "desc" : "asc" }
          : undefined,
        where: needFilter
          ? { name: input.name ? { contains: input.name } : undefined }
          : undefined,
      };

      const [count, stores] = await ctx.prisma.$transaction([
        ctx.prisma.store.count({ where: params.where }),
        ctx.prisma.store.findMany({
          ...params,
          skip: input.page * input.perPage,
          take: input.perPage,
        }),
      ]);
      return { count, stores };
    }),
  getOne: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const store = await ctx.prisma.store.findUnique({
      where: { id: input },
      include: { roles: true },
    });
    if (!store) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found!" });
    }
    return store;
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        address: z.string(),
        published: z.boolean().default(true),
      })
    )
    .mutation(({ ctx, input }) => {
      const { name, address, published } = input;
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
        name: z.string().min(1),
        address: z.string().min(1),
        published: z.boolean().default(true),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, name, address, published } = input;
      return ctx.prisma.store.update({
        where: { id },
        data: {
          name,
          address,
          published,
          updatedBy: ctx.session.user.email,
        },
      });
    }),

  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.store.delete({ where: { id: input } });
  }),
  addRole: adminProcedure
    .input(
      z.object({
        storeId: z.string(),
        profileId: z.string(),
        roleType: z.nativeEnum(ROLE_TYPE),
      })
    )
    .mutation(({ ctx, input }) => {
      const { profileId, storeId, roleType } = input;
      return ctx.prisma.role.create({
        data: {
          profileId,
          storeId,
          type: roleType,
          addedBy: ctx.session.user.email,
        },
      });
    }),
  deleteRole: adminProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.role.delete({
      where: { id: input },
    });
  }),
});
