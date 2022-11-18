import { Button, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { trpc } from "../trpc";

export const UserDeletePage: React.FC = () => {
  const router = useRouter();
  const deleteMe = useMutation({
    mutationFn: () => {
      return trpc.me.delete.mutate();
    },
    onSuccess: () => {
      showNotification({
        color: "green",
        title: "ユーザーの削除",
        message: "ユーザーを削除しました。",
      });
      router.reload();
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "ユーザーの削除",
        message: "ユーザーを削除できませんでした。",
      });
    },
  });

  const handleDeleteUser = () => {
    deleteMe.mutate();
  };

  return (
    <div>
      <Text fw="bold" size={32}>
        ユーザー削除
      </Text>
      <Text>
        ユーザーを削除すると、作成したすべてのデータが削除され、復元することができなくなります。
      </Text>
      <Text>それでもユーザーを削除しますか？</Text>
      <Button variant="light" color="red" onClick={handleDeleteUser}>
        ユーザーを削除する
      </Button>
    </div>
  );
};
