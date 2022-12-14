import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Pagination,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { SyntheticEvent, useState } from "react";
import { Route } from "../consts/route";
import { useLoginModal } from "../contexts/useLoginModalContext";
import { usePagingThemesQuery } from "../hooks/usePagingThemesQuery";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { RouterInput, trpc } from "../trpc";

export const HomePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { session } = useSessionQuery();
  const { openLoginModal } = useLoginModal();

  const [page, setPage] = useState(1);
  const { pagingThemes } = usePagingThemesQuery({ page });

  const deleteMutation = useMutation({
    mutationFn: (data: RouterInput["themes"]["delete"]) => {
      return trpc.themes.delete.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["themes"]);
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "お題の削除",
        message: "お題の削除に失敗しました。",
      });
    },
  });

  const handleDeleteMutation = (id: string) => {
    deleteMutation.mutate({ themeId: id });
  };

  const handleClickGoThemeCreate = (e: SyntheticEvent) => {
    if (!session) {
      e.preventDefault();
      openLoginModal({ callbackUrlAfterLogin: "/themes/create" });
    }
  };

  return (
    <div>
      <Title order={3} color="gray.8">
        アプリ開発のお題
      </Title>
      <Button
        component={Link}
        href={Route.createTheme}
        onClick={handleClickGoThemeCreate}
      >
        お題を投稿する
      </Button>
      <Button ml="md" component={Link} href={Route.searchTheme}>
        お題を検索する
      </Button>
      <Button ml="md" component={Link} href={Route.createRepository}>
        リポジトリを作成する
      </Button>

      <Stack mt={30}>
        {pagingThemes?.themes.map((theme) => {
          return (
            <Card key={theme.id} p="md" radius="md" withBorder>
              <Title order={3}>{theme.title}</Title>
              <Flex align="center" gap={5}>
                <Avatar mt={5} src={theme.user.image} radius="xl" size="md" />
                <Text>{theme.user.name}</Text>
              </Flex>
              <Flex mt={8}>
                {theme.tags.map((tag) => {
                  return (
                    <Badge key={tag.id} sx={{ textTransform: "none" }}>
                      {tag.name}
                    </Badge>
                  );
                })}
              </Flex>
              <Flex gap={10} mt={10}>
                <Button component={Link} href={Route.themeDetail(theme.id)}>
                  詳細
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDeleteMutation(theme.id)}
                >
                  削除する
                </Button>
              </Flex>
            </Card>
          );
        })}
      </Stack>
      <Pagination
        page={page}
        onChange={setPage}
        total={pagingThemes?.allPages ?? 0}
      />
    </div>
  );
};
