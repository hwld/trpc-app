import { ActionIcon, Tooltip } from "@mantine/core";
import Link from "next/link";
import { IconType } from "react-icons";

type Props = {
  icon: IconType;
  label: string;
  onClick?: () => void;
  href: string;
  active?: boolean;
};
export const SideMenuLink: React.FC<Props> = ({
  icon,
  label,
  href,
  active = false,
}) => {
  const Icon = icon;
  return (
    <Tooltip label={label} position="right" bg="gray.7">
      <ActionIcon
        component={Link}
        href={href}
        radius="md"
        size="xl"
        // bg="gray.2"
        sx={(theme) => ({
          transition: "all 150ms",
          backgroundColor: `${active ? theme.colors.gray[1] : "transparent"}`,
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: theme.shadows.md,
            "&>svg": {
              fill: theme.colors.red[7],
            },
          },
          "&:active": {
            transform: "scale(1)",
          },
          "&>svg": {
            fill: `${active ? theme.colors.red[7] : theme.colors.gray[1]}`,
          },
        })}
      >
        <Icon size="60%" />
      </ActionIcon>
    </Tooltip>
  );
};
