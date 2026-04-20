import type { Meta, StoryObj } from "@storybook/react";
import { ErrorState } from "./errorState";

const meta = {
  title: "Organisms/ErrorState",
  component: ErrorState,
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unauthorized: Story = {};
