import {
  Avatar,
  Card,
  Divider,
  Flex,
  Menu,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { AiOutlineUser } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import {
  MdFavorite,
  MdOutlineComputer,
  MdOutlineLogout,
  MdOutlineSettings,
} from "react-icons/md";

type Props = { loggedInUser: Session["user"] | undefined };
export const UserCard: React.FC<Props> = ({ loggedInUser }) => {
  const mantineTheme = useMantineTheme();
  return (
    <Menu position="bottom-start">
      <Menu.Target>
        <UnstyledButton>
          <Card
            radius="md"
            w="300px"
            p="sm"
            bg="red.7"
            sx={(theme) => ({
              flexShrink: 0,
              boxShadow: `2px 4px 6px ${theme.fn.rgba(
                theme.colors.red[7],
                0.3
              )}`,
            })}
          >
            <Flex gap="sm">
              <Avatar size="md" radius="xl" src={loggedInUser?.image} />
              <Stack spacing={5} sx={{ flexGrow: 1 }}>
                <Text color="gray.1">{loggedInUser?.name}</Text>
                <Flex
                  gap="xs"
                  bg="gray.1"
                  px={10}
                  py={3}
                  sx={(theme) => ({
                    borderRadius: "5px",
                  })}
                >
                  <Flex align="center">
                    <MdFavorite color={mantineTheme.colors.red[7]} />
                    <Text color="red.7" size="xs">
                      10
                    </Text>
                  </Flex>
                  <Flex align="center" gap={2}>
                    <MdOutlineComputer color={mantineTheme.colors.red[7]} />
                    <Text color="red.7" size="xs">
                      3
                    </Text>
                  </Flex>
                </Flex>
              </Stack>
            </Flex>
          </Card>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>ユーザー</Menu.Label>
        <Divider />
        <Menu.Item icon={<MdOutlineSettings />}>ユーザー設定</Menu.Item>
        <Menu.Item icon={<AiOutlineUser />}>プロフィール</Menu.Item>
        <Menu.Item
          icon={<MdOutlineLogout />}
          color="red"
          onClick={() => signOut()}
        >
          ログアウト
        </Menu.Item>
        <Menu.Item icon={<FaTrash />} color="red">
          アカウント削除
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
