import { TRPCError } from "@trpc/server";
import { db } from "../lib/prisma";
import { middleware } from "./idnex";

export const isLoggedIn = middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  const user = await db.user.findFirst({
    where: { id: ctx.session.user.id },
  });
  if (!user) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next({ ctx: { loggedInUser: user } });
});
