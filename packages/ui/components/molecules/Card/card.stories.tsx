import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "../../atoms/Text/text";
import { Card } from "./card";

const meta = {
  title: "Molecules/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    eyebrow: "Workspace",
    title: "Card Surface",
    description: "A reusable content container for sections, settings, summaries, or access states.",
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <Text tone="muted">Cards give us a clean default shell with optional title, description, and footer areas.</Text>
    </Card>
  ),
};
