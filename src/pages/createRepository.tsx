import { trpc } from "@/client/trpc";
import { Button, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { NextPage } from "next";
import { useState } from "react";

const CreateRepository: NextPage = () => {
  const [repoName, setRepoName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");

  const createMutation = useMutation({
    mutationFn: () => {
      return trpc.github.createRepo.mutate({ repoName });
    },
    onSuccess: (data) => {
      showNotification({ color: "green", message: "作成" });
      setRepoUrl(data);
    },
    onError: () => {
      showNotification({ color: "red", message: "エラー" });
    },
  });

  const handleCreateRepo = () => {
    createMutation.mutate();
  };

  return (
    <div>
      <TextInput
        label="リポジトリ名"
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
      />
      <Button mt="md" onClick={handleCreateRepo}>
        リポジトリを作成
      </Button>
      <TextInput label="リポジトリURL" mt="xl" value={repoUrl} readOnly />
    </div>
  );
};
export default CreateRepository;
