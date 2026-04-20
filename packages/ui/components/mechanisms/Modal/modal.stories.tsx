import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../atoms/Button/button";
import { Text } from "../../atoms/Text/text";
import { Modal } from "./modal";

const meta = {
  title: "Mechanisms/Modal",
  component: Modal,
  tags: ["autodocs"],
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          description="This modal can host simple content or complex feature UIs."
          footer={<Button onClick={() => setOpen(false)}>Close</Button>}
          onClose={() => setOpen(false)}
          open={open}
          title="Modal Mechanism"
        >
          <Text tone="muted">It supports overlay close, escape close, and explicit dismissal.</Text>
        </Modal>
      </>
    );
  },
};
