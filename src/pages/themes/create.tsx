import { ThemeCreatePage } from "@/client/components/CreateThemePage";
import { allTagsQueryKey } from "@/client/hooks/useAllTagsQuery";
import { withQueryClientGetServerSideProps } from "@/server/lib/withQueryClientGetServerSideProps";
import { appRouter } from "@/server/routers/_app";

export const getServerSideProps = withQueryClientGetServerSideProps(
  async ({ queryClient, session }) => {
    if (!session?.user) {
      return { redirect: { destination: "/", permanent: false } };
    }

    const caller = appRouter.createCaller({ session });

    await queryClient.prefetchQuery(allTagsQueryKey, () =>
      caller.themes.getAllTags()
    );
  }
);

const CreateTheme = () => {
  return <ThemeCreatePage />;
};

export default CreateTheme;
