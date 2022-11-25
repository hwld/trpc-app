import { ProfileUpdatePage } from "@/client/components/ProfileUpdatePage";
import { sessionQueryKey } from "@/client/hooks/useSessionQuery";
import { GetServerSidePropsWithReactQuery } from "@/server/lib/nextUtils";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOption } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, authOption);

  if (!session?.user) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const queryClient = new QueryClient();
  queryClient.setQueryData(sessionQueryKey, session);
  const dehydratedState = dehydrate(queryClient);

  return { props: { dehydratedState } };
};

const Me: NextPage = () => {
  return <ProfileUpdatePage />;
};
export default Me;
