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
import { useAllTagsQuery } from "../hooks/useAllTagsQuery";
import { useSearchedThemesQuery } from "../hooks/useSearchedThemesQuery";
import { useStateAndUrlParamString } from "../hooks/useStateAndUrlParamString";
import { useStateAndUrlParamStringArray } from "../hooks/useStateAndUrlParamStringArray";
import { Link } from "./Link";

export const ThemeSearchPage: React.FC = () => {
  const { allTags } = useAllTagsQuery();

  const [keyword, setKeyword] = useStateAndUrlParamString({
    paramName: "keyword",
    initialData: "",
  });

  const [selectedTagIds, setSelectedTagIds] = useStateAndUrlParamStringArray({
    paramName: "tagIds",
    initialData: [],
  });

  const { searchedThemes } = useSearchedThemesQuery({
    keyword,
    tagIds: selectedTagIds,
  });

  const handleChangeKeyword = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(value);
  };

  const handleChangeTagIds = (ids: string[]) => {
    setSelectedTagIds(ids);
  };

  const handleClearCondition = () => {
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
          searchable
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
