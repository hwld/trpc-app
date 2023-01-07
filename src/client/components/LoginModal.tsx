import { Button, Modal, Stack, Text } from "@mantine/core";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { useLoginModal } from "../contexts/useLoginModalContext";

export const LoginModal = () => {
  const { isLoginModalOpen, callbackUrlAfterLogin, closeLoginModal } =
    useLoginModal();

  const handleLogin = () => {
    signIn("github", { callbackUrl: callbackUrlAfterLogin });
  };

  return (
    <Modal
      centered
      opened={isLoginModalOpen}
      onClose={closeLoginModal}
      title="ログイン"
      overlayOpacity={0.5}
      styles={{ title: { fontWeight: "bold", fontSize: "21px" } }}
    >
      <Stack>
        <Text>この機能を利用するためには、ログインをする必要があります。</Text>
        <Button leftIcon={<FaGithub size="21" />} onClick={handleLogin}>
          Githubでログイン
        </Button>
      </Stack>
    </Modal>
  );
};
