import { sessionQueryKey } from "@/client/hooks/useSessionQuery";
import { authOption } from "@/pages/api/auth/[...nextauth]";
import { QueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { stringifyDehydrate } from "./superjson";

export type QueryClientPageProps = { stringifiedDehydratedState?: string };

type withQueryClientGetServerSidePropsCallback = (params: {
  params: GetServerSidePropsContext;
  queryClient: QueryClient;
  session: Session | null;
}) => Promise<GetServerSidePropsResult<QueryClientPageProps> | void>;

export const withQueryClientGetServerSideProps = (
  callback: withQueryClientGetServerSidePropsCallback
) => {
  return async (
    params: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<QueryClientPageProps>> => {
    // sessionデータをsetしておく
    const queryClient = new QueryClient();
    const session = await unstable_getServerSession(
      params.req,
      params.res,
      authOption
    );
    queryClient.setQueryData(sessionQueryKey, session);

    const result = await callback({ params, queryClient, session });
    if (result) {
      return result;
    }

    return {
      props: { stringifiedDehydratedState: stringifyDehydrate(queryClient) },
    };
  };
};
