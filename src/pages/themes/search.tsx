import { ThemeSearchPage } from "@/client/components/ThemeSearchPage";
import { allTagsQueryKey } from "@/client/hooks/useAllTagsQuery";
import { searchedThemesQueryKey } from "@/client/hooks/useSearchedThemesQuery";
import { withQueryClientGetServerSideProps } from "@/server/lib/withQueryClientGetServerSideProps";
import { appRouter } from "@/server/routers/_app";

export const getServerSideProps = withQueryClientGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    const caller = appRouter.createCaller({ session });

    await queryClient.prefetchQuery(allTagsQueryKey, () =>
      caller.themes.getAllTags()
    );
    await queryClient.prefetchQuery(
      searchedThemesQueryKey({ keyword: query.keyword, tagIds: query.tagIds }),
      () =>
        caller.themes.search({ keyword: query.keyword, tagIds: query.tagIds })
    );
  }
);

export default function ThemeSearch() {
  return <ThemeSearchPage />;
}
