import { trpc } from "@/client/trpc";
import { Button, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { authOption } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOption);

  if (!session?.user) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: { session } };
};

const Me: NextPage = () => {
  const updateMe = trpc.updateMe.useMutation({
    onSuccess() {
      showNotification({
        color: "green",
        title: "ユーザー更新",
        message: "ユーザーを更新しました。",
      });
    },
    onError() {
      showNotification({
        color: "red",
        title: "ユーザー更新",
        message: "ユーザーを更新できませんでした。",
      });
    },
  });
  const session = useSession();
  const [name, setName] = useState(session.data?.user?.name || "");

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
export default Me;
