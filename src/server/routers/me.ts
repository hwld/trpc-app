import { z } from "zod";
import { prisma } from "../prisma";
import { router } from "../trpc/idnex";
import { requireLoggedInProcedure } from "../trpc/procedures";

export const meRoute = router({
  update: requireLoggedInProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await prisma.user.update({
        where: { id: ctx.loggedInUser.id },
        data: { name: input.name },
      });
    }),
  delete: requireLoggedInProcedure.mutation(async ({ ctx }) => {
    await prisma.user.delete({ where: { id: ctx.loggedInUser.id } });
  }),
});
