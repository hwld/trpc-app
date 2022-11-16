import { TRPCError } from "@trpc/server";
import { prisma } from "../prisma";
import { middleware } from "./idnex";

export const isLoggedIn = middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  const user = await prisma.user.findFirst({
    where: { id: ctx.session.user.id },
  });
  if (!user) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next({ ctx: { loggedInUser: user } });
});
