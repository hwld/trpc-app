import { ThemeCreatePage } from "@/client/components/CreateThemePage";
import { allTagsQueryKey } from "@/client/hooks/useAllTagsQuery";
import { sessionQueryKey } from "@/client/hooks/useSessionQuery";
import { GetServerSidePropsWithReactQuery } from "@/server/lib/nextUtils";
import { appRouter } from "@/server/routers/_app";
import { dehydrate, QueryClient } from "@tanstack/react-query";
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

  const caller = appRouter.createCaller({ session });
  const allTags = await caller.themes.getAllTags();

  const queryClient = new QueryClient();
  queryClient.setQueryData(sessionQueryKey, session);
  queryClient.setQueryData(allTagsQueryKey, allTags);
  const dehydratedState = dehydrate(queryClient);

  return {
    props: {
      dehydratedState,
    },
  };
};

const CreateTheme = () => {
  return <ThemeCreatePage />;
};

export default CreateTheme;
