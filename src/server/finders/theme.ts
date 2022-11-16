import { prisma } from "../prisma";

export const findTheme = async (id: string) => {
  const theme = await prisma.appTheme.findUnique({
    where: { id },
    include: { appThemeTags: true, user: true },
  });
  if (!theme) {
    return undefined;
  }

  return {
    id: theme.id,
    title: theme.title,
    description: theme.description,
    tags: theme.appThemeTags.map(({ id, name }) => ({ id, name })),
    user: {
      id: theme.user.id,
      name: theme.user.name,
      image: theme.user.image,
    },
  };
};
