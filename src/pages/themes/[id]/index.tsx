import { trpc } from "@/client/trpc";
import { GetServerSidePropsWithReactQuery } from "@/server/lib/nextUtils";
import { appRouter } from "@/server/routers/_app";
import { Avatar, Badge, Box, Flex, Stack, Text, Title } from "@mantine/core";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { InferGetServerSidePropsType, NextPage } from "next";

export const getServerSideProps: GetServerSidePropsWithReactQuery<{
  themeId: string;
}> = async ({ query }) => {
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
  await queryClient.prefetchQuery(["themes", themeId], async () => {
    return theme;
  });

  return {
    props: { dehydratedState: dehydrate(queryClient), themeId: themeId },
  };
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const ThemeDetail: NextPage<PageProps> = ({ themeId }) => {
  const { data: theme } = useQuery(["themes", themeId], () => {
    return trpc.themes.get.query({ themeId });
  });

  return (
    <Box p={30}>
      <Stack>
        <Flex gap={10}>
          <Avatar src={theme?.user.image} size={60} radius="xl" />
          <Text fw="bold" size={20}>
            {theme?.user.name}
          </Text>
        </Flex>
        <Title>{theme?.title}</Title>
        <Flex gap={5} mt={5}>
          {theme?.tags.map((tag) => {
            return (
              <Badge key={tag.id} sx={{ textTransform: "none" }}>
                {tag.name}
              </Badge>
            );
          })}
        </Flex>
        <Text sx={{ whiteSpace: "pre-wrap" }}>{theme?.description}</Text>
      </Stack>
    </Box>
  );
};
export default ThemeDetail;
