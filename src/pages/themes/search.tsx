import { ThemeSearchPage } from "@/client/components/ThemeSearchPage";
import { allTagsQueryKey } from "@/client/hooks/useAllTagsQuery";
import { sessionQueryKey } from "@/client/hooks/useSessionQuery";
import { appRouter } from "@/server/routers/_app";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOption } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = await unstable_getServerSession(req, res, authOption);

  const caller = appRouter.createCaller({ session: null });
  const allTags = await caller.themes.getAllTags();

  const keyword = query.keyword;
  const tagIds = query.tagIds;

  const searchedThemes = await caller.themes.search({
    keyword: typeof keyword === "string" ? keyword : "",
    tagIds:
      typeof tagIds === "string"
        ? [tagIds]
        : typeof tagIds === "object"
        ? tagIds
        : [],
  });

  const queryClient = new QueryClient();
  queryClient.setQueryData(sessionQueryKey, session);
  queryClient.setQueryData(allTagsQueryKey, allTags);
  //query paramで指定されたワードの検索結果を入れておく
  queryClient.setQueryData(
    ["search", keyword ?? "", tagIds ?? []],
    searchedThemes
  );

  const dehydratedState = dehydrate(queryClient);

  return {
    props: {
      dehydratedState,
    },
  };
};

export default function ThemeSearch() {
  return <ThemeSearchPage />;
}
