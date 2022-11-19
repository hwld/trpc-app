import { ThemeDetailPage } from "@/client/components/ThemeDetailPage";
import { themeDetailQueryKey } from "@/client/hooks/useThemeDetailQuery";
import { GetServerSidePropsWithReactQuery } from "@/server/lib/nextUtils";
import { appRouter } from "@/server/routers/_app";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { NextPage } from "next";

export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  query,
}) => {
  const { id: themeId } = query;
  if (typeof themeId !== "string") {
    throw new Error("Bad Request");
  }

  // tRPCのrouterを直接呼ぶ
  const theme = appRouter
    .createCaller({ session: null })
    .themes.get({ themeId });

  // react-queryに初期データとしてセットする
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(themeDetailQueryKey(themeId), async () => {
    return theme;
  });

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
};

const ThemeDetail: NextPage = () => {
  return <ThemeDetailPage />;
};
export default ThemeDetail;
