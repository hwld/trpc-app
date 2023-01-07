import { Flex } from "@mantine/core";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import { BiMedal } from "react-icons/bi";
import { FaReact } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { MdOutlineHome, MdOutlinePostAdd } from "react-icons/md";
import { Route } from "../consts/route";
import { SideMenuLink } from "./SideMenuAction";

type Props = { loggedInUser: Session["user"] | undefined };
export const SideMenu: React.FC<Props> = ({ loggedInUser }) => {
  const router = useRouter();

  return (
    <Flex
      direction="column"
      w="60px"
      bg="red.7"
      pos="sticky"
      top={16}
      h="calc(100vh - 32px)"
      sx={(theme) => ({
        zIndex: 2,
        borderRadius: "10px",
        boxShadow: `1px 5px 10px ${theme.fn.rgba(theme.colors.red[7], 0.5)}`,
      })}
      gap={"xl"}
      align="center"
      justify="space-between"
      p="md"
    >
      <Flex direction="column" gap="xl">
        <Flex
          justify="center"
          align="center"
          w="60px"
          h="60px"
          sx={(theme) => ({
            "&>svg": {
              color: theme.colors.gray[1],
            },
          })}
        >
          <FaReact size="60%" />
        </Flex>

        <Flex direction="column" align="center" gap="md">
          <SideMenuLink
            icon={MdOutlineHome}
            label="ホーム"
            href={Route.home}
            active={router.pathname === Route.home}
          />
          <SideMenuLink
            icon={IoSearchSharp}
            label="検索"
            href={Route.searchTheme}
            active={router.pathname === Route.searchTheme}
          />
          <SideMenuLink icon={BiMedal} label="ランキング" href={Route.home} />
          <SideMenuLink
            icon={MdOutlinePostAdd}
            label="投稿"
            href={Route.createTheme}
            active={router.pathname === Route.createTheme}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
