import { OmitStrict } from "@/share/types/OmitStrict";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "../prisma";

export const themeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.object({ id: z.string(), name: z.string() })),
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
  likeCounts: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
type Theme = z.infer<typeof themeSchema>;

// パフォーマンスを考えるなら、APIごとにargsとschemaを作ったほうが良さそう
const themeArgs = {
  include: {
    appThemeTags: { include: { tag: true, theme: true } },
    user: true,
    _count: { select: { likes: true } },
  },
} satisfies Prisma.AppThemeArgs;

type RawTheme = Prisma.AppThemeGetPayload<typeof themeArgs>;

const convertTheme = (rawTheme: RawTheme): Theme => {
  const theme = {
    id: rawTheme.id,
    title: rawTheme.title,
    description: rawTheme.description,
    tags: rawTheme.appThemeTags.map(({ tag: { id, name } }) => ({ id, name })),
    user: {
      id: rawTheme.user.id,
      name: rawTheme.user.name,
      image: rawTheme.user.image,
    },
    likeCounts: rawTheme._count.likes,
    createdAt: rawTheme.createdAt.toUTCString(),
    updatedAt: rawTheme.updatedAt.toUTCString(),
  };

  return theme;
};

export const findTheme = async (
  where: Prisma.AppThemeFindUniqueArgs["where"]
): Promise<Theme | undefined> => {
  const rawTheme = await db.appTheme.findUnique({
    where,
    ...themeArgs,
  });
  if (!rawTheme) {
    return undefined;
  }

  const theme = convertTheme(rawTheme);

  return theme;
};

export const themesWithPagingSchema = z.object({
  themes: z.array(themeSchema),
  allPages: z.number(),
});

export const findThemes = async (
  args: OmitStrict<Prisma.AppThemeFindManyArgs, "include" | "select">,
  transactionClient?: Prisma.TransactionClient
): Promise<Theme[]> => {
  const client = transactionClient ?? db;

  const rawThemes = await client.appTheme.findMany({
    ...args,
    ...themeArgs,
  });

  const themes: Theme[] = rawThemes.map(convertTheme);

  return themes;
};

export const searchThemeIds = async (
  { keyword, tagIds }: { keyword: string; tagIds: string[] },
  transactionClient?: Prisma.TransactionClient
) => {
  const client = transactionClient ?? db;

  type SearchedThemeIds = { themeId: string }[];
  const themeIds = await client.$queryRaw<SearchedThemeIds>`
    SELECT
      AppTheme.id as themeId
    FROM
      AppTheme
      LEFT JOIN AppThemeTagOnAppTheme
        ON(AppThemeTagOnAppTheme.themeId = AppTheme.id)
    WHERE
      ${
        keyword
          ? Prisma.sql`
      AppTheme.title LIKE ${"%" + keyword + "%"}`
          : "1 = 1"
      }
      ${
        tagIds.length > 0
          ? Prisma.sql`
      AND tagId IN (${Prisma.join(tagIds)})`
          : Prisma.empty
      }
    GROUP BY
      AppTheme.id
    ${
      tagIds.length > 0
        ? Prisma.sql`
    HAVING
      COUNT(themeId) = ${tagIds.length}`
        : Prisma.empty
    }
  `;

  return themeIds.map((t) => t.themeId);
};
