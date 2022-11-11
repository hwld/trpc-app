import { trpc } from "@/client/trpc";
import { Button, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { authOption } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOption);

  if (!session?.user) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: { session } };
};

const DeleteMe: NextPage = () => {
  const router = useRouter();
  const deleteMe = trpc.deleteMe.useMutation({
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

export default DeleteMe;
