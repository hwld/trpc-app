import { HomePage } from "@/client/components/HomePage";
import { sessionQueryKey } from "@/client/hooks/useSessionQuery";
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

  const themes = await appRouter
    .createCaller({ session: null })
    .themes.getAll();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(sessionQueryKey, () => session);
  await queryClient.prefetchQuery(["themes"], () => themes);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function Home() {
  return <HomePage />;
}
