import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../prisma";
import { router } from "../trpc/idnex";
import { publicProcedure, requireLoggedInProcedure } from "../trpc/procedures";

export const themesRoute = router({
  getAll: publicProcedure.query(async () => {
    const rawThemes = await prisma.appTheme.findMany({
      include: { appThemeTags: true, user: true },
    });

    const themes = rawThemes.map(
      ({
        id,
        title,
        description,
        createdAt,
        updatedAt,
        user,
        appThemeTags,
      }) => ({
        id,
        title,
        description,
        user: { name: user.name, image: user.image },
        createdAt: createdAt.toUTCString(),
        updatedAt: updatedAt.toUTCString(),
        tags: appThemeTags.map(({ id, name }) => ({ id, name })),
      })
    );

    return themes;
  }),

  get: publicProcedure
    .input(z.object({ themeId: z.string().min(1) }))
    .query(async ({ input }) => {
      const rawTheme = await prisma.appTheme.findUnique({
        where: { id: input.themeId },
        include: { appThemeTags: true, user: true },
      });
      if (!rawTheme) {
        return undefined;
      }

      const theme = {
        id: rawTheme.id,
        title: rawTheme.title,
        description: rawTheme.description,
        tags: rawTheme.appThemeTags.map(({ id, name }) => ({ id, name })),
        user: {
          id: rawTheme.user.id,
          name: rawTheme.user.name,
          image: rawTheme.user.image,
        },
      };

      if (!theme) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      return theme;
    }),

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
