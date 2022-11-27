import { ThemeSearchPage } from "@/client/components/ThemeSearchPage";
import { allTagsQueryKey } from "@/client/hooks/useAllTagsQuery";
import { searchedThemesQueryKey } from "@/client/hooks/useSearchedThemesQuery";
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

  const searchedThemes = await caller.themes.search({ keyword, tagIds });

  const queryClient = new QueryClient();
  queryClient.setQueryData(sessionQueryKey, session);
  queryClient.setQueryData(allTagsQueryKey, allTags);
  //query paramで指定されたワードの検索結果を入れておく
  queryClient.setQueryData(
    searchedThemesQueryKey({ keyword, tagIds }),
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
