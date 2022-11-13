import { Textarea } from "@/client/components/Textarea";
import { RouterInput, trpc } from "@/client/trpc";
import { prisma } from "@/server/prisma";
import { Button, MultiSelect, Stack, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { AppThemeTag } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { authOption } from "../api/auth/[...nextauth]";

type PageProps = { allTags: Pick<AppThemeTag, "id" | "name">[] };

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  req,
  res,
}) => {
  const allTags = await prisma.appThemeTag.findMany();
  const session = await unstable_getServerSession(req, res, authOption);

  if (!session?.user) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return {
    props: {
      allTags: allTags.map((t) => ({ id: t.id, name: t.name })),
      session,
    },
  };
};

const CreateTheme: NextPage<PageProps> = ({ allTags }) => {
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
      router.push("/");
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

export default CreateTheme;
