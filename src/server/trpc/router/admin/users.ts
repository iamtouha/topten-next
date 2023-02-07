import { type Prisma, USER_ROLE } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, adminProcedure } from "../../trpc";

export const usersAdminRouter = router({
  list: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({ include: { profile: true } });
  }),
  profileList: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.profile.findMany({
      where: { user: { active: true } },
      select: { id: true, fullName: true },
    });
  }),
  get: adminProcedure
    .input(
      z.object({
        page: z.number().int().default(0),
        perPage: z.number().int().default(10),
        email: z.string().optional(),
        name: z.string().optional(),
        active: z.boolean().optional(),
        role: z.nativeEnum(USER_ROLE).optional(),
        sortBy: z
          .enum(["email", "name", "role", "active", "createdAt"])
          .optional(),
        sortDesc: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const needFilter = input.email || input.name || input.role;

      const params: Prisma.UserFindManyArgs = {
        orderBy: input.sortBy
          ? { [input.sortBy]: input.sortDesc ? "desc" : "asc" }
          : undefined,
        where: needFilter
          ? {
              AND: {
                email: input.email ? { contains: input.email } : undefined,
                name: input.name ? { contains: input.name } : undefined,
                role: input.role,
              },
            }
          : undefined,
      };

      const [count, users] = await ctx.prisma.$transaction([
        ctx.prisma.user.count({ where: params.where }),
        ctx.prisma.user.findMany({
          ...params,
          include: { profile: true },
          skip: input.page * input.perPage,
          take: input.perPage,
        }),
      ]);
      return { count, users };
    }),
  getOne: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: input },
      include: { profile: { include: { roles: true } } },
    });
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found!" });
    }
    return user;
  }),
  updateRole: adminProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.nativeEnum(USER_ROLE),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== USER_ROLE.SUPER_ADMIN) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Forbidden!" });
      }

      if (ctx.session.user.id === input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can't change your own role!",
        });
      }

      const userData = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });
      if (!userData) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found!" });
      }

      if (userData.role === input.role) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Role is the same!",
        });
      }

      if (!userData.active) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is not active!",
        });
      }

      const user = await ctx.prisma.user.update({
        where: { id: input.id },
        data: { role: input.role },
      });
      return user;
    }),
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        active: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id === input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can't activate yourself!",
        });
      }
      const userData = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });
      if (!userData) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found!" });
      }

      if (userData.role !== USER_ROLE.USER) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't deactivate an admin!",
        });
      }

      const user = await ctx.prisma.user.update({
        where: { id: input.id },
        data: { active: input.active },
      });
      return user;
    }),

  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    if (ctx.session.user.role !== USER_ROLE.SUPER_ADMIN) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    if (ctx.session.user.id === input) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You can't delete yourself!",
      });
    }

    const userData = await ctx.prisma.user.findUnique({
      where: { id: input },
    });
    if (!userData) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found!" });
    }

    if (userData.role !== USER_ROLE.USER) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You can't delete an admin!",
      });
    }
    const [user] = await ctx.prisma.$transaction([
      ctx.prisma.user.delete({ where: { id: input } }),
      ctx.prisma.profile.deleteMany({ where: { user: { id: input } } }),
    ]);
    return user;
  }),
});
