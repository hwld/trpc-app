import { Header, Text } from "@mantine/core";

type Props = {};
export const AppHeader: React.FC<Props> = () => {
  return (
    <Header height={60} style={{ display: "flex", alignItems: "center" }}>
      <Text fw={700} ml={20} size={32}>
        tRPC-App
      </Text>
    </Header>
  );
};
