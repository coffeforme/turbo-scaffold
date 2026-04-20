import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./text";

const meta = {
  title: "Atoms/Text",
  component: Text,
  tags: ["autodocs"],
  args: {
    children: "Shared text styles help keep headings, body copy, and helper states consistent.",
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Muted: Story = {
  args: {
    tone: "muted",
  },
};

export const Strong: Story = {
  args: {
    weight: "strong",
    size: "lg",
  },
};
