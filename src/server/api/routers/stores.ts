import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  employeeProcedure,
} from "../trpc";

export const storesRouter = createTRPCRouter({
  get: employeeProcedure.query(async ({ ctx }) => {
    return ctx.prisma.role.findMany({
      where: {
        profileId: ctx.session.user.profileId,
        store: { published: true },
      },
      include: { store: true },
    });
  }),
});
