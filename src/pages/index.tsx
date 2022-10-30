import { Button, Center } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { trpc } from "../client/trpc";

export default function Home() {
  const hello = trpc.hello.useQuery({ text: "client" });

  const handleClickShow = () => {
    showNotification({
      title: "サーバーからのメッセージ",
      message: hello.data?.greeting ?? "loading...",
    });
  };

  return (
    <Center sx={{ minHeight: "100vh", minWidth: "100vh" }}>
      <Button onClick={handleClickShow}>Show</Button>
    </Center>
  );
}
