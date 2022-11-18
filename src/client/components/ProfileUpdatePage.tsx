import { Button, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { sessionQueryKey, useSessionQuery } from "../hooks/useSessionQuery";
import { RouterInput, trpc } from "../trpc";

export const ProfileUpdatePage: React.FC = () => {
  const queryClient = useQueryClient();

  const updateMe = useMutation({
    mutationFn: (data: RouterInput["me"]["update"]) => {
      return trpc.me.update.mutate(data);
    },
    onSuccess() {
      showNotification({
        color: "green",
        title: "ユーザー更新",
        message: "ユーザーを更新しました。",
      });
      queryClient.invalidateQueries(sessionQueryKey);
    },
    onError() {
      showNotification({
        color: "red",
        title: "ユーザー更新",
        message: "ユーザーを更新できませんでした。",
      });
    },
  });

  const { session } = useSessionQuery();
  const [name, setName] = useState(session?.user.name || "");

  const handleUpdate = () => {
    updateMe.mutate({ name });
  };

  return (
    <div>
      <TextInput
        label="名前"
        value={name}
        onChange={({ target: { value } }) => {
          setName(value);
        }}
      />
      <Button onClick={handleUpdate}>変更</Button>
    </div>
  );
};
