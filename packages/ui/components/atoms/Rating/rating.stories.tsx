import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Rating } from "./rating";

const meta = {
  title: "Atoms/Rating",
  component: Rating,
  tags: ["autodocs"],
  args: {
    value: 3,
    maxRating: 5,
    size: "md",
    disabled: false,
  },
} satisfies Meta<typeof Rating>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <Rating {...args} value={value} onChange={setValue} />;
  },
};

export const Disabled: Story = {
  args: {
    value: 4,
    disabled: true,
  },
  render: (args) => <Rating {...args} onChange={() => undefined} />,
};
