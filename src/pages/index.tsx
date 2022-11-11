import {
  AppShell,
  Avatar,
  Button,
  Header,
  Navbar,
  Stack,
  Text,
} from "@mantine/core";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { authOption } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOption
      ),
    },
  };
};

export default function Home() {
  const session = useSession();

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
      main
    </AppShell>
  );
}
