import { noto } from "@/pages/_app";
import { MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = {
  fontFamily: `${noto.style.fontFamily}, sans-serif;`,
  headings: {
    fontFamily: `${noto.style.fontFamily}, sans-serif;`,
  },
  primaryColor: "red",
  primaryShade: 7,
  colors: {
    gray: [
      "#fafaf9",
      "#f5f5f4",
      "#e7e5e4",
      "#d6d3d1",
      "#a8a29e",
      "#78716c",
      "#57534e",
      "#44403c",
      "#292524",
      "#1c1917",
    ],
    red: [
      "#fef2f2",
      "#fee2e2",
      "#fecaca",
      "#fca5a5",
      "#f87171",
      "#ef4444",
      "#dc2626",
      "#b91c1c",
      "#991b1b",
      "#7f1d1d",
    ],
  },
  components: { Card: { defaultProps: { bg: "gray.1" } } },
};
