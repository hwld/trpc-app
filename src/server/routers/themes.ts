import { z } from "zod";
import { prisma } from "../prisma";
import { requireLoggedInProcedure } from "../procedures";
import { router } from "../trpc";

export const themesRoute = router({
  create: requireLoggedInProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        tags: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 指定されたタグが存在していなかった場合は、とりあえず500エラーを出す
      await prisma.appTheme.create({
        data: {
          title: input.title,
          description: input.description,
          userId: ctx.userId,
          appThemeTags: { connect: input.tags.map((t) => ({ id: t })) },
        },
      });
    }),
});
