import { ThemeSearchPage } from "@/client/components/ThemeSearchPage";
import { allTagsQueryKey } from "@/client/hooks/useAllTagsQuery";
import { appRouter } from "@/server/routers/_app";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  const caller = appRouter.createCaller({ session: null });
  const allTags = await caller.themes.getAllTags();

  const queryClient = new QueryClient();
  queryClient.setQueryData(allTagsQueryKey, allTags);
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
