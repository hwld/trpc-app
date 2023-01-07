import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { SortOrder } from "../lib/dbUtil";
import { paginate } from "../lib/paginate";
import { db } from "../lib/prisma";
import {
  findTheme,
  findThemes,
  searchThemeIds,
  themesWithPagingSchema,
} from "../models/theme";
import { router } from "../trpc/idnex";
import { publicProcedure, requireLoggedInProcedure } from "../trpc/procedures";

export const themesRoute = router({
  getRaw: publicProcedure.query(async () => {
    return await db.appTheme.findMany({});
  }),
  getMany: publicProcedure
    .input(z.object({ page: z.number().optional() }))
    .output(themesWithPagingSchema)
    .query(async ({ input: { page = 1 } }) => {
      const limit = 1;
      const { data: themes, allPages } = await paginate({
        finder: findThemes,
        finderInput: { orderBy: { createdAt: SortOrder.desc } },
        counter: db.appTheme.count,
        pagingData: { page, limit },
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

  search: publicProcedure
    .input(
      z.object({
        keyword: z
          .string()
          .or(z.undefined())
          .or(z.array(z.string()))
          .transform((keyword) => {
            return typeof keyword === "object"
              ? keyword[0]
              : typeof keyword === "string"
              ? keyword
              : "";
          }),
        tagIds: z
          .array(z.string())
          .or(z.string())
          .or(z.undefined())
          .transform((ids) => {
            return typeof ids === "string"
              ? [ids]
              : typeof ids === "object"
              ? ids
              : [];
          }),
      })
    )
    .query(async ({ input }) => {
      const searchedThemes = await db.$transaction(async (tx) => {
        // 検索結果のお題のidを取得する
        const searchedThemeIds = await searchThemeIds(
          {
            keyword: input.keyword,
            tagIds: input.tagIds,
          },
          tx
        );

        // idからお代を取得する
        const { data: searchedThemes, allPages } = await paginate({
          transactionClient: tx,
          finder: findThemes,
          finderInput: { where: { id: { in: searchedThemeIds } } },
          counter: db.appTheme.count,
          pagingData: { page: 1, limit: 100 },
        });

        return searchedThemes;
      });

      return searchedThemes;
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
      await db.appTheme.create({
        data: {
          title: input.title,
          description: input.description,
          userId: ctx.loggedInUser.id,
          appThemeTags: {
            create: input.tags.map((tagId) => ({
              tag: { connect: { id: tagId } },
            })),
          },
        },
      });
    }),

  delete: requireLoggedInProcedure
    .input(z.object({ themeId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      // 投稿者がログインユーザーである、指定されたidのお題が存在するか確認する。
      const theme = await db.appTheme.findFirst({
        where: { id: input.themeId, userId: ctx.loggedInUser.id },
      });
      if (!theme) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await db.appTheme.delete({ where: { id: theme.id } });
    }),

  getAllTags: publicProcedure.query(async () => {
    const rawTags = await db.appThemeTag.findMany();
    const tags = rawTags.map(({ id, name }) => ({
      id,
      name,
    }));

    return tags;
  }),

  like: requireLoggedInProcedure
    .input(z.object({ themeId: z.string().min(1), like: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const theme = await db.appTheme.findFirst({
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
        await db.appThemeLike.create({
          data: {
            appTheme: { connect: { id: input.themeId } },
            user: { connect: { id: ctx.loggedInUser.id } },
          },
        });
      } else {
        // いいねを外す
        await db.appThemeLike.delete({
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
      const liked = await db.appThemeLike.findUnique({
        where: {
          appThemeId_userId: {
            appThemeId: input.themeId,
            userId: ctx.loggedInUser.id,
          },
        },
      });

      return !(liked === null);
    }),

  getAllDevelopers: publicProcedure
    .input(z.object({ themeId: z.string() }))
    .query(async ({ input }) => {
      const rawDeveloprs = await db.appThemeDeveloper.findMany({
        where: { themeId: input.themeId },
        include: { user: true },
      });
      const developers = rawDeveloprs.map(({ id, user: { name } }) => ({
        id,
        userName: name,
      }));

      return developers;
    }),

  join: requireLoggedInProcedure
    .input(z.object({ themeId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await db.appThemeDeveloper.create({
        data: {
          theme: { connect: { id: input.themeId } },
          user: { connect: { id: ctx.loggedInUser.id } },
        },
      });
    }),
  cancelJoin: requireLoggedInProcedure
    .input(z.object({ themeId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await db.appThemeDeveloper.delete({
        where: {
          themeId_userId: {
            themeId: input.themeId,
            userId: ctx.loggedInUser.id,
          },
        },
      });
    }),
});
