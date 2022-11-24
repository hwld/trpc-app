import {
  Avatar,
  Badge,
  Card,
  Flex,
  MultiSelect,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAllTagsQuery } from "../hooks/useAllTagsQuery";
import { trpc } from "../trpc";

export const ThemeSearchPage: React.FC = () => {
  const { allTags } = useAllTagsQuery();

  const [keyword, setKeyword] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const { data } = useQuery(
    ["search", keyword, selectedTagIds],
    () => {
      return trpc.themes.search.query({ keyword, tagIds: selectedTagIds });
    },
    { keepPreviousData: true }
  );

  return (
    <>
      <Card shadow="lg" bg="gray.1" sx={{ position: "static" }}>
        <Title>検索</Title>
        <TextInput
          label="キーワード"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <MultiSelect
          data={allTags.map((tag) => ({ value: tag.id, label: tag.name }))}
          label="タグ"
          value={selectedTagIds}
          onChange={setSelectedTagIds}
        />
      </Card>
      <Flex gap="md" wrap="wrap">
        {data?.map((theme) => {
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
            </Card>
          );
        })}
      </Flex>
    </>
  );
};
