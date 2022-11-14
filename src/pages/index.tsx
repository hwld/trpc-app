import { RouterInput, trpc } from "@/client/trpc";
import { prisma } from "@/server/prisma";
import {
  AppShell,
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Header,
  Navbar,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { authOption } from "./api/auth/[...nextauth]";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const themes = (
    await prisma.appTheme.findMany({
      include: { appThemeTags: true, user: true },
    })
  ).map(
    ({ id, title, description, createdAt, updatedAt, user, appThemeTags }) => ({
      id,
      title,
      description,
      user: { name: user.name, image: user.image },
      createdAt: createdAt.toUTCString(),
      updatedAt: updatedAt.toUTCString(),
      appThemeTags: appThemeTags.map(({ id, name }) => ({ id, name })),
    })
  );

  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOption
      ),
      themes,
    },
  };
};

export default function Home({
  themes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: (data: RouterInput["themes"]["delete"]) => {
      return trpc.themes.delete.mutate(data);
    },
    onSuccess: () => {
      router.reload();
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "お題の削除",
        message: "お題の削除に失敗しました。",
      });
    },
  });

  const handleDeleteMutation = (id: string) => {
    deleteMutation.mutate({ themeId: id });
  };

  return (
    <AppShell
      navbar={
        <Navbar width={{ base: 300 }}>
          <div>
            {session.status === "unauthenticated" && (
              <Button onClick={() => signIn("github")}>ログイン</Button>
            )}
            {session.status === "authenticated" && (
              <>
                <Avatar src={session.data.user?.image} size={100} radius={50} />
                <Text>{session.data.user?.name}</Text>
                <Stack spacing="xs" m={10}>
                  <Button onClick={() => signOut()} color="red">
                    ログアウト
                  </Button>

                  <Button component={Link} href="/users/me">
                    プロフィールを編集する
                  </Button>

                  <Button
                    variant="outline"
                    color="red"
                    component={Link}
                    href="/users/delete"
                  >
                    ユーザーを削除する
                  </Button>
                </Stack>
              </>
            )}
          </div>
        </Navbar>
      }
      header={
        <Header
          height={60}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Text fw={700} ml={20} size={32}>
            tRPC-App
          </Text>
        </Header>
      }
    >
      <Title color="gray.8">アプリ開発のお題</Title>
      <Button component={Link} href="/themes/create">
        お題を投稿する
      </Button>
      <Stack mt={30}>
        {themes.map((theme) => {
          return (
            <Card key={theme.id} p="md" radius="md" withBorder>
              <Title order={3}>{theme.title}</Title>
              <Flex align="center" gap={5}>
                <Avatar mt={5} src={theme.user.image} radius="xl" size="md" />
                <Text>{theme.user.name}</Text>
              </Flex>
              <Flex mt={8}>
                {theme.appThemeTags.map((tag) => {
                  return (
                    <Badge key={tag.id} sx={{ textTransform: "none" }}>
                      {tag.name}
                    </Badge>
                  );
                })}
              </Flex>
              <Button mt={10} onClick={() => handleDeleteMutation(theme.id)}>
                削除する
              </Button>
            </Card>
          );
        })}
      </Stack>
    </AppShell>
  );
}
