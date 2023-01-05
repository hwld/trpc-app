import { Box, Button, Flex, Group, Modal } from "@mantine/core";
import { signIn } from "next-auth/react";
import { ReactNode } from "react";
import { FaGithub } from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import { useLoginModal } from "../contexts/useLoginModalContext";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { SideMenu } from "./SideMenu";
import { UserCard } from "./UserCard";

type Props = { children: ReactNode };
export const AppLayout: React.FC<Props> = ({ children }) => {
  const { session } = useSessionQuery();
  const { isLoginModalOpen, closeLoginModal } = useLoginModal();

  const handleLogin = () => {
    signIn("github");
  };

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
        <Modal
          opened={isLoginModalOpen}
          onClose={closeLoginModal}
          title="ログイン"
          overlayOpacity={0.5}
          styles={{ title: { fontWeight: "bold", fontSize: "21px" } }}
        >
          <Group>
            <Button leftIcon={<FaGithub size="21" />} onClick={handleLogin}>
              Githubでログイン
            </Button>
          </Group>
        </Modal>
      </Box>
    </Flex>
  );
};
