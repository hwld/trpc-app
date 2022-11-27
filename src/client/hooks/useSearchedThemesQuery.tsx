import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

type Args = {
  keyword: string | string[] | undefined;
  tagIds: string | string[] | undefined;
};
export const searchedThemesQueryKey = ({ keyword, tagIds }: Args) => {
  return [
    "themes",
    "search",
    {
      keyword:
        typeof keyword === "object"
          ? keyword[0]
          : typeof keyword === "string"
          ? keyword
          : "",
      tagIds:
        typeof tagIds === "string"
          ? [tagIds]
          : typeof tagIds === "object"
          ? tagIds
          : [],
    },
  ];
};
export const useSearchedThemesQuery = ({ keyword, tagIds }: Args) => {
  const { data, ...others } = useQuery(
    searchedThemesQueryKey({ keyword, tagIds }),
    () => {
      return trpc.themes.search.query({ keyword, tagIds });
    }
  );

  return { searchedThemes: data, ...others };
};
