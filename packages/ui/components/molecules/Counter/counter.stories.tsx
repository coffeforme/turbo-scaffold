import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Counter } from "./counter";

const meta = {
  title: "Molecules/Counter",
  component: Counter,
  tags: ["autodocs"],
  args: {
    value: 0,
  },
} satisfies Meta<typeof Counter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <Counter value={value} onIncrement={() => setValue((current) => current + 1)} />;
  },
};
