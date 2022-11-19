import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const pagingThemesQueryKey = (page: number) => ["themes", "page", page];

type UsePaginThemesQueryInput = { page: number };
export const usePagingThemesQuery = ({ page }: UsePaginThemesQueryInput) => {
  const { data: pagingThemes, ...others } = useQuery(
    ["themes", "page", page],
    () => {
      return trpc.themes.getMany.query({ page });
    },
    { keepPreviousData: true }
  );

  return { pagingThemes, ...others };
};
