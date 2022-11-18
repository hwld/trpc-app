import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const allTagsQueryKey = ["allTags"];

export const useAllTagsQuery = () => {
  const { data: allTags, ...others } = useQuery(
    allTagsQueryKey,
    () => {
      return trpc.themes.getAllTags.query();
    },
    { initialData: [] }
  );

  return { allTags, others };
};
