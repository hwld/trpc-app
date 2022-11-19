import { Avatar, Badge, Box, Flex, Stack, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { useThemeDetailQuery } from "../hooks/useThemeDetailQuery";

export const ThemeDetailPage = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const { theme } = useThemeDetailQuery(themeId);

  return (
    <Box p={30}>
      <Stack>
        <Flex gap={10}>
          <Avatar src={theme?.user.image} size={60} radius="xl" />
          <Text fw="bold" size={20}>
            {theme?.user.name}
          </Text>
        </Flex>
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
    </Box>
  );
};
