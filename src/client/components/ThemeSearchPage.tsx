import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  MultiSelect,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAllTagsQuery } from "../hooks/useAllTagsQuery";
import { useSearchedThemesQuery } from "../hooks/useSearchedThemesQuery";
import { Link } from "./Link";

export const ThemeSearchPage: React.FC = () => {
  const router = useRouter();

  const { allTags } = useAllTagsQuery();

  const [keyword, setKeyword] = useState(
    typeof router.query.keyword === "string" ? router.query.keyword : ""
  );

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    typeof router.query.tagIds === "string"
      ? [router.query.tagIds]
      : typeof router.query.tagIds === "object"
      ? router.query.tagIds
      : []
  );

  const { searchedThemes } = useSearchedThemesQuery({
    keyword,
    tagIds: selectedTagIds,
  });

  const handleChangeKeyword: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    const url = new URL(window.location.href);
    url.searchParams.set("keyword", value);
    if (value === "") {
      url.searchParams.delete("keyword");
    }
    router.replace(url, undefined, {
      shallow: true,
    });

    setKeyword(value);
  };

  const handleChangeTagIds = (ids: string[]) => {
    const url = new URL(window.location.href);
    url.searchParams.delete("tagIds");
    ids.forEach((id) => {
      url.searchParams.append("tagIds", id);
    });
    router.replace(url, undefined, { shallow: true });

    setSelectedTagIds(ids);
  };

  const handleClearCondition = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("keyword");
    url.searchParams.delete("tagIds");
    router.replace(url, undefined, { shallow: true });
    setKeyword("");
    setSelectedTagIds([]);
  };

  return (
    <>
      <Card shadow="lg" bg="gray.1" sx={{ position: "static" }}>
        <Title>検索</Title>

        <TextInput
          label="キーワード"
          value={keyword}
          onChange={handleChangeKeyword}
        />
        <MultiSelect
          data={allTags.map((tag) => ({ value: tag.id, label: tag.name }))}
          label="タグ"
          value={selectedTagIds}
          onChange={handleChangeTagIds}
        />
        <Button mt="md" onClick={handleClearCondition}>
          クリア
        </Button>
      </Card>
      <Flex gap="md" wrap="wrap">
        {searchedThemes?.map((theme) => {
          return (
            <UnstyledButton
              key={theme.id}
              component={Link}
              href={`/themes/${theme.id}`}
            >
              <Card p="md" radius="md" withBorder>
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
            </UnstyledButton>
          );
        })}
      </Flex>
    </>
  );
};
