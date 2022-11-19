import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const themeDetailQueryKey = (themeId: string) => ["themes", themeId];

export const useThemeDetailQuery = (themeId: string) => {
  const { data: theme, ...others } = useQuery(["themes", themeId], () => {
    return trpc.themes.get.query({ themeId });
  });

  return { theme, others };
};
