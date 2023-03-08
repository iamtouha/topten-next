import { USER_ROLE } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  employeeProcedure,
} from "../trpc";

export const userRouter = createTRPCRouter({
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
});
