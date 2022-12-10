import { HomePage } from "@/client/components/HomePage";
import { pagingThemesQueryKey } from "@/client/hooks/usePagingThemesQuery";
import { withQueryClientGetServerSideProps } from "@/server/lib/withQueryClientGetServerSideProps";
import { appRouter } from "@/server/routers/_app";

export const getServerSideProps = withQueryClientGetServerSideProps(
  async ({ queryClient, session }) => {
    const caller = appRouter.createCaller({ session });

    await queryClient.prefetchQuery(pagingThemesQueryKey(1), () =>
      caller.themes.getMany({ page: 1 })
    );
  }
);

export default function Home() {
  return <HomePage />;
}
