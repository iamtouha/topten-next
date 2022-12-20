import { USER_ROLE } from "@prisma/client";
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

  all: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(40).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const users = await ctx.prisma.user.findMany({
        include: { profile: true },
        take: limit + 1,
        where: {},
        cursor: input.cursor
          ? {
              id: input.cursor,
            }
          : undefined,
        orderBy: {
          createdAt: "asc",
        },
      });
      let nextCursor: typeof input.cursor | undefined = undefined;
      if (users.length > limit) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nextItem = users.pop()!;
        nextCursor = nextItem.id;
      }
      return {
        users: users.reverse(),
        nextCursor,
      };
    }),
});
