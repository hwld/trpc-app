import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../prisma";
import { middleware, procedure, router } from "../trpc";

const isLoggedIn = middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  const user = await prisma.user.findFirst({
    where: { id: ctx.session.userId },
  });
  if (!user) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next({ ctx: { user, userId: ctx.session.userId } });
});

const requireLoggedInProcedure = procedure.use(isLoggedIn);

export const appRouter = router({
  updateMe: requireLoggedInProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await prisma.user.update({
        where: { id: ctx.userId },
        data: { name: input.name },
      });
    }),
  deleteMe: requireLoggedInProcedure.mutation(async ({ ctx }) => {
    await prisma.user.delete({ where: { id: ctx.userId } });
  }),
});

export type AppRouter = typeof appRouter;
