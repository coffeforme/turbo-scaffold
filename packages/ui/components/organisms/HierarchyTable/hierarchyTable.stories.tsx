import type { Meta, StoryObj } from "@storybook/react";
import { HierarchyTable } from "./hierarchyTable";

const meta = {
  title: "Organisms/HierarchyTable",
  component: HierarchyTable as any,
  tags: ["autodocs"],
} satisfies Meta<any>;

export default meta;

type Story = StoryObj<typeof meta>;

const rows = [
  {
    id: "workspace",
    name: "Workspace",
    type: "Root",
    owner: "Platform",
    children: [
      {
        id: "team-alpha",
        name: "Team Alpha",
        type: "Team",
        owner: "Ada",
        children: [
          {
            id: "asset-library",
            name: "Asset Library",
            type: "Collection",
            owner: "Grace",
          },
        ],
      },
    ],
  },
];

export const Default: Story = {
  render: () => (
    <HierarchyTable
      columns={[
        { header: "Node", render: (row) => row.name },
        { header: "Type", render: (row) => row.type },
        { header: "Owner", render: (row) => row.owner },
      ]}
      rows={rows}
    />
  ),
};
