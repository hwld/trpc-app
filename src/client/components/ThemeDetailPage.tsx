import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import {
  themeDetailQueryKey,
  useThemeDetailQuery,
} from "../hooks/useThemeDetailQuery";
import { RouterInput, trpc } from "../trpc";

export const ThemeDetailPage = () => {
  const router = useRouter();
  const themeId = router.query.id as string;

  const queryClient = useQueryClient();
  const { theme } = useThemeDetailQuery(themeId);

  const { data: liked } = useQuery(["themes", "page", themeId, "liked"], () => {
    return trpc.themes.liked.query({ themeId });
  });

  const likeMutation = useMutation({
    mutationFn: (data: RouterInput["themes"]["like"]) => {
      return trpc.themes.like.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(themeDetailQueryKey(themeId));
      queryClient.invalidateQueries(["themes", "page", themeId, "liked"]);
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "いいね",
        message: "いいね・いいね解除できませんでした。",
      });
    },
  });

  const handleLike = () => {
    likeMutation.mutate({ themeId, like: !liked });
  };

  //開発者を取得
  const { data: developers } = useQuery({
    queryKey: ["all-developers"],
    queryFn: () => {
      if (!theme) {
        return;
      }
      return trpc.themes.getAllDevelopers.query({ themeId: theme?.id });
    },
  });

  // 参加
  const joinMutation = useMutation({
    mutationFn: (data: RouterInput["themes"]["join"]) => {
      return trpc.themes.join.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-developers"]);
    },
    onError: () => {
      showNotification({ color: "red", message: "エラー" });
    },
  });

  const handleJoin = () => {
    if (!theme) {
      return;
    }
    joinMutation.mutate({ themeId: theme.id });
  };

  const cancelJoinMutation = useMutation({
    mutationFn: (data: RouterInput["themes"]["cancelJoin"]) => {
      return trpc.themes.cancelJoin.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-developers"]);
    },
    onError: () => {
      showNotification({ color: "red", message: "エラー" });
    },
  });

  const handleCancelJoin = () => {
    if (!theme) {
      return;
    }
    cancelJoinMutation.mutate({ themeId: theme.id });
  };

  return (
    <Box p={30}>
      <Stack>
        <Flex gap={10}>
          <Avatar src={theme?.user.image} size={60} radius="xl" />
          <Text fw="bold" size={20}>
            {theme?.user.name}
          </Text>
        </Flex>
        <Stack spacing="sm">
          {liked ? (
            <ActionIcon
              variant="outline"
              size={60}
              radius={60}
              color="pink"
              onClick={handleLike}
            >
              <MdFavorite size="50%" />
            </ActionIcon>
          ) : (
            <ActionIcon
              variant="outline"
              size={60}
              radius={60}
              onClick={handleLike}
            >
              <MdFavoriteBorder size="50%" />
            </ActionIcon>
          )}
          <Text>{theme?.likeCounts ?? 0}</Text>
        </Stack>

        <Title>{theme?.title}</Title>
        <Flex gap={5} mt={5}>
          {theme?.tags.map((tag) => {
            return (
              <Badge key={tag.id} sx={{ textTransform: "none" }}>
                {tag.name}
              </Badge>
            );
          })}
        </Flex>
        <Text sx={{ whiteSpace: "pre-wrap" }}>{theme?.description}</Text>
      </Stack>
      <Button onClick={handleJoin}>参加する</Button>
      <Text mt="lg">参加者</Text>
      <Stack>
        {developers?.map((d) => {
          return (
            <Card p="lg" withBorder key={d.id}>
              <Flex justify="space-between">
                <Text>{d.userName}</Text>
                <Button onClick={handleCancelJoin}>キャンセル</Button>
              </Flex>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};
