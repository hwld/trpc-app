import { z } from "zod";
import { prisma } from "../prisma";
import { requireLoggedInProcedure } from "../procedures";
import { router } from "../trpc";

export const meRoute = router({
  update: requireLoggedInProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await prisma.user.update({
        where: { id: ctx.userId },
        data: { name: input.name },
      });
    }),
  delete: requireLoggedInProcedure.mutation(async ({ ctx }) => {
    await prisma.user.delete({ where: { id: ctx.userId } });
  }),
});
