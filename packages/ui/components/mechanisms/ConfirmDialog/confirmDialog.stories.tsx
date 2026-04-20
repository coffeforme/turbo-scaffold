import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../atoms/Button/button";
import { Text } from "../../atoms/Text/text";
import { ConfirmDialog } from "./confirmDialog";

const meta = {
  title: "Mechanisms/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof ConfirmDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open confirm dialog</Button>
        <ConfirmDialog
          confirmLabel={confirmed ? "Confirmed" : "Confirm action"}
          description="Confirmation mechanisms wrap the modal behavior around an explicit decision flow."
          onClose={() => setOpen(false)}
          onConfirm={() => {
            setConfirmed(true);
            setOpen(false);
          }}
          open={open}
          title="Confirm destructive action"
        >
          <Text tone="muted">Choose confirm to complete the demo action.</Text>
        </ConfirmDialog>
      </>
    );
  },
};
