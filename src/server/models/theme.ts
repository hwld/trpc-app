import { OmitStrict } from "@/share/types/OmitStrict";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../prisma";

const ThemeSchema = z.object({
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
type Theme = z.infer<typeof ThemeSchema>;

const themeArgs = Prisma.validator<Prisma.AppThemeArgs>()({
  include: {
    appThemeTags: true,
    user: true,
    _count: { select: { likes: true } },
  },
});

const convertTheme = (
  rawTheme: Prisma.AppThemeGetPayload<typeof themeArgs>
): Theme => {
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
    likeCounts: rawTheme._count.likes,
    createdAt: rawTheme.createdAt.toUTCString(),
    updatedAt: rawTheme.updatedAt.toUTCString(),
  };

  return theme;
};

export const findTheme = async (
  where: Prisma.AppThemeFindUniqueArgs["where"]
): Promise<Theme | undefined> => {
  const rawTheme = await prisma.appTheme.findUnique({
    where,
    ...themeArgs,
  });
  if (!rawTheme) {
    return undefined;
  }

  const theme = convertTheme(rawTheme);

  return theme;
};

export const findThemes = async (
  args: OmitStrict<Prisma.AppThemeFindManyArgs, "include" | "select">
) => {
  const rawThemes = await prisma.appTheme.findMany({
    ...args,
    ...themeArgs,
  });

  const themes: Theme[] = rawThemes.map(convertTheme);

  return themes;
};
