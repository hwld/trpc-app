import { Avatar, Button, Navbar, Stack, Text } from "@mantine/core";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Route } from "../consts/route";

type Props = { user?: Session["user"] | undefined };
export const AppNavbar: React.FC<Props> = ({ user }) => {
  return (
    <Navbar width={{ base: 300 }}>
      <div>
        {user ? (
          <>
            <Avatar src={user.image} size={100} radius={50} />
            <Text>{user.name}</Text>
            <Stack spacing="xs" m={10}>
              <Button onClick={() => signOut()} color="red">
                ログアウト
              </Button>
              <Button component={Link} href={Route.me}>
                プロフィールを編集する
              </Button>

              <Button
                variant="outline"
                color="red"
                component={Link}
                href={Route.deleteUser}
              >
                ユーザーを削除する
              </Button>
            </Stack>
          </>
        ) : (
          <Button onClick={() => signIn("github")}>ログイン</Button>
        )}
      </div>
    </Navbar>
  );
};
