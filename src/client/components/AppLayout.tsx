import { Box, Button, Flex } from "@mantine/core";
import { signIn } from "next-auth/react";
import { ReactNode } from "react";
import { MdLogin } from "react-icons/md";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { LoginModal } from "./LoginModal";
import { SideMenu } from "./SideMenu";
import { UserCard } from "./UserCard";

type Props = { children: ReactNode };
export const AppLayout: React.FC<Props> = ({ children }) => {
  const { session } = useSessionQuery();

  return (
    <Flex mih="100vh" gap={40} p="md" bg="gray.2">
      <SideMenu loggedInUser={session?.user} />
      <Box w="100%">
        <Flex
          justify="flex-end"
          pos="sticky"
          top={16}
          sx={{ zIndex: 2 }}
          mb={16}
        >
          {session ? (
            <UserCard loggedInUser={session?.user} />
          ) : (
            <Button onClick={() => signIn("github")} leftIcon={<MdLogin />}>
              ログイン
            </Button>
          )}
        </Flex>
        <Box>{children}</Box>
        <LoginModal />
      </Box>
    </Flex>
  );
};
