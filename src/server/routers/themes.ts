import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../db/prisma";
import { router } from "../trpc/idnex";
import { requireLoggedInProcedure } from "../trpc/procedures";

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
          userId: ctx.loggedInUser.id,
          appThemeTags: { connect: input.tags.map((t) => ({ id: t })) },
        },
      });
    }),

  delete: requireLoggedInProcedure
    .input(z.object({ themeId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      // 投稿者がログインユーザーである、指定されたidのお題が存在するか確認する。
      const theme = await prisma.appTheme.findFirst({
        where: { id: input.themeId, userId: ctx.loggedInUser.id },
      });
      if (!theme) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await prisma.appTheme.delete({ where: { id: theme.id } });
    }),
});
