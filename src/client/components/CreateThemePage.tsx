import { Button, MultiSelect, Stack, Textarea, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { Route } from "../consts/route";
import { useAllTagsQuery } from "../hooks/useAllTagsQuery";
import { RouterInput, trpc } from "../trpc";

export const ThemeCreatePage: React.FC = () => {
  const { allTags } = useAllTagsQuery();

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  const router = useRouter();

  const createTheme = useMutation({
    mutationFn: async (data: RouterInput["themes"]["create"]) => {
      return trpc.themes.create.mutate(data);
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "投稿",
        message: "投稿に失敗しました。",
      });
    },
    onSuccess: () => {
      showNotification({
        color: "green",
        title: "投稿",
        message: "投稿しました。",
      });
      router.push(Route.home);
    },
  });

  const handleClickCreate = () => {
    createTheme.mutate({ title, tags, description });
  };

  return (
    <Stack m={30}>
      <TextInput
        label="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <MultiSelect
        label="タグ"
        data={allTags.map((t) => ({ value: t.id, label: t.name }))}
        onChange={(e) => setTags(e)}
        searchable
      />
      <Textarea
        label="説明"
        minRows={10}
        autosize
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button onClick={handleClickCreate}>投稿する</Button>
    </Stack>
  );
};
