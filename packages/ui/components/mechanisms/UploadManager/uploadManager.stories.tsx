import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../atoms/Button/button";
import { UploadManagerPanel, UploadManagerProvider, useUploadManager } from "./uploadManager";

function UploadManagerDemo() {
  const { openUploadPicker } = useUploadManager();

  return (
    <div style={{ minHeight: "24rem" }}>
      <Button
        onClick={() =>
          openUploadPicker({
            source: {
              page: "Storybook",
              section: "Upload Manager",
            },
          })
        }
      >
        Trigger Upload
      </Button>
      <UploadManagerPanel />
    </div>
  );
}

const meta = {
  title: "Mechanisms/UploadManager",
  component: UploadManagerDemo,
  render: () => (
    <UploadManagerProvider mode="zustand">
      <UploadManagerDemo />
    </UploadManagerProvider>
  ),
} satisfies Meta<typeof UploadManagerDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
