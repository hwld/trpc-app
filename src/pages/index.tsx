import { HomePage } from "@/client/components/HomePage";
import { GetServerSidePropsWithReactQuery } from "@/server/lib/nextUtils";
import { appRouter } from "@/server/routers/_app";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { Session, unstable_getServerSession } from "next-auth";
import { authOption } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSidePropsWithReactQuery<{
  session: Session | null;
}> = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOption);

  const themes = await appRouter
    .createCaller({ session: null })
    .themes.getAll();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["themes"], async () => themes);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      session,
    },
  };
};

export default function Home() {
  return <HomePage />;
}
