import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { findTheme, findThemes, themesWithPagingSchema } from "../models/theme";
import { prisma } from "../prisma";
import { router } from "../trpc/idnex";
import { publicProcedure, requireLoggedInProcedure } from "../trpc/procedures";

export const themesRoute = router({
  getMany: publicProcedure
    .input(z.object({ page: z.number().optional() }))
    .output(themesWithPagingSchema)
    .query(async ({ input: { page = 1 } }) => {
      const limit = 1;
      const { themes, allPages } = await findThemes({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      return { themes, allPages };
    }),

  get: publicProcedure
    .input(z.object({ themeId: z.string().min(1) }))
    .query(async ({ input }) => {
      const theme = await findTheme({ id: input.themeId });

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

  getAllTags: publicProcedure.query(async () => {
    const rawTags = await prisma.appThemeTag.findMany();
    const tags = rawTags.map(({ id, name }) => ({
      id,
      name,
    }));

    return tags;
  }),

  like: requireLoggedInProcedure
    .input(z.object({ themeId: z.string().min(1), like: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const theme = await prisma.appTheme.findFirst({
        where: { id: input.themeId },
      });
      if (!theme) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      // ログインユーザーがテーマの投稿者だったらエラー
      if (theme.userId === ctx.loggedInUser.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      if (input.like) {
        // いいねをつける
        await prisma.appThemeLike.create({
          data: {
            appTheme: { connect: { id: input.themeId } },
            user: { connect: { id: ctx.loggedInUser.id } },
          },
        });
      } else {
        // いいねを外す
        await prisma.appThemeLike.delete({
          where: {
            appThemeId_userId: {
              appThemeId: input.themeId,
              userId: ctx.loggedInUser.id,
            },
          },
        });
      }
    }),
  liked: requireLoggedInProcedure
    .input(z.object({ themeId: z.string() }))
    .query(async ({ input, ctx }) => {
      const liked = await prisma.appThemeLike.findUnique({
        where: {
          appThemeId_userId: {
            appThemeId: input.themeId,
            userId: ctx.loggedInUser.id,
          },
        },
      });

      return !(liked === null);
    }),
});
