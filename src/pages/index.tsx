import { AppShell, Avatar, Button, Header, Navbar, Text } from "@mantine/core";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
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
      styles={(theme) => ({ main: { backgroundColor: theme.colors.gray[1] } })}
      navbar={<Navbar width={{ base: 300 }}>Nav</Navbar>}
      header={
        <Header
          height={60}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          bg="red"
        >
          <Text fw={700} ml={20} size={32} c="gray.0">
            tRPC-App
          </Text>
        </Header>
      }
    >
      {session.status === "unauthenticated" && (
        <Button onClick={() => signIn("github")}>ログイン</Button>
      )}
      {session.status === "authenticated" && (
        <>
          <Avatar src={session.data.user?.image} size={100} radius={100} />
          <Text>{session.data.user?.name}</Text>
          <Button onClick={() => signOut()} color="red">
            ログアウト
          </Button>
        </>
      )}
    </AppShell>
  );
}
