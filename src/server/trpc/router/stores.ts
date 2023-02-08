import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, protectedProcedure, employeeProcedure } from "../trpc";

export const storesRouter = router({
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
