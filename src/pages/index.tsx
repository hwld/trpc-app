import { HomePage } from "@/client/components/HomePage";
import { sessionQueryKey } from "@/client/hooks/useSessionQuery";
import { pagingThemesQueryKey } from "@/client/hooks/usePagingThemesQuery";
import { GetServerSidePropsWithReactQuery } from "@/server/lib/nextUtils";
import { appRouter } from "@/server/routers/_app";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { unstable_getServerSession } from "next-auth";
import { authOption } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, authOption);

  const caller = appRouter.createCaller({ session });
  // URLのpageクエリでプリフェッチして
  // クライアント側のuseRouterでもpageクエリを使用してkeyを指定すると
  // プリフェッチされたデータを取得できる？
  const firstPageThemes = await caller.themes.getMany({ page: 1 });

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(sessionQueryKey, () => session);
  await queryClient.prefetchQuery(
    pagingThemesQueryKey(1),
    () => firstPageThemes
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function Home() {
  return <HomePage />;
}
