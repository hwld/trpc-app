import { ThemeDetailPage } from "@/client/components/ThemeDetailPage";
import { themeDetailQueryKey } from "@/client/hooks/useThemeDetailQuery";
import { withQueryClientGetServerSideProps } from "@/server/lib/withQueryClientGetServerSideProps";
import { appRouter } from "@/server/routers/_app";
import { NextPage } from "next";

export const getServerSideProps = withQueryClientGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    const { id: themeId } = query;
    if (typeof themeId !== "string") {
      throw new Error("Bad Request");
    }

    const caller = appRouter.createCaller({ session });

    await queryClient.prefetchQuery(themeDetailQueryKey(themeId), () =>
      caller.themes.get({ themeId })
    );
  }
);

const ThemeDetail: NextPage = () => {
  return <ThemeDetailPage />;
};
export default ThemeDetail;
