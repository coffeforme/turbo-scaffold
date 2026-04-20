import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./table";

const meta = {
  title: "Molecules/Table",
  component: Table as any,
  tags: ["autodocs"],
} satisfies Meta<any>;

export default meta;

type Story = StoryObj<typeof meta>;

const rows = [
  { name: "Ada Lovelace", role: "Admin", permission: "delete" },
  { name: "Grace Hopper", role: "Maintainer", permission: "upload" },
  { name: "Linus Torvalds", role: "Viewer", permission: "view" },
];

export const Default: Story = {
  render: () => (
    <Table
      caption="Team access overview"
      columns={[
        { header: "Name", key: "name" },
        { header: "Role", key: "role" },
        { header: "Permission", key: "permission" },
      ]}
      rows={rows}
    />
  ),
};
