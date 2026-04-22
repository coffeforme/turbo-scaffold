import type { Meta, StoryObj } from "@storybook/react";
import { UploadInput } from "./uploadInput";

const meta = {
  title: "Atoms/UploadInput",
  component: UploadInput,
  args: {
    label: "Attach files",
    helperText: "Use the upload input directly or through the upload manager.",
    multiple: true,
  },
} satisfies Meta<typeof UploadInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
