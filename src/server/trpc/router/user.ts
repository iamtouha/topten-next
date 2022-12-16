import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, protectedProcedure, employeeProcedure } from "../trpc";

export const userRouter = router({
  createProfile: protectedProcedure
    .input(
      z.object({
        fullName: z.string().min(5),
        phone: z.string().min(11).max(15),
        designation: z.string().min(4).max(32),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.profileId) {
        throw new TRPCError({
          message: "User profile already exists",
          code: "FORBIDDEN",
        });
      }
      return await ctx.prisma.profile.create({
        data: {
          user: { connect: { id: ctx.session.user.id } },
          fullName: input.fullName,
          phone: input.phone,
          designation: input.designation,
        },
      });
    }),

  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    const users = await prisma.user.findMany({
      include: { profile: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    return users;
  }),

  findUserById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;
      const user = await prisma.user.findUnique({
        where: { id },
        include: { profile: true },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No user with id: ${id}`,
        });
      }
      return user;
    }),
});
