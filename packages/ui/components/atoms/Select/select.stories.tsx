import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./select";

const meta = {
  title: "Atoms/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    disabled: false,
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("general");

    return (
      <Select
        {...args}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      >
        <option value="general">General</option>
        <option value="ui">User Interface</option>
        <option value="performance">Performance</option>
        <option value="support">Support</option>
      </Select>
    );
  },
};
