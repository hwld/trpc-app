import { TRPCError } from "@trpc/server";
import { prisma } from "./prisma";
import { middleware } from "./trpc";

export const isLoggedIn = middleware(async ({ ctx, next }) => {
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
