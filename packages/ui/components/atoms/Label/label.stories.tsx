import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../Input/input";
import { Label } from "./label";

const meta = {
  title: "Atoms/Label",
  component: Label,
  tags: ["autodocs"],
  args: {
    children: "Field label",
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInput: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "0.5rem", minWidth: "18rem" }}>
      <Label {...args} htmlFor="storybook-input">
        Email
      </Label>
      <Input id="storybook-input" type="email" placeholder="you@example.com" />
    </div>
  ),
};
