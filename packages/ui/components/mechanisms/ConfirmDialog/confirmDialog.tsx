import type { ReactNode } from "react";
import { Button } from "../../atoms/Button/button";
import { Modal } from "../Modal/modal";
import styles from "./confirmDialog.module.scss";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  children?: ReactNode;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  pending = false,
  children,
}: ConfirmDialogProps) {
  return (
    <Modal
      description={description}
      footer={
        <div className={styles.actions}>
          <Button disabled={pending} onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button className={styles.confirm} disabled={pending} onClick={onConfirm}>
            {pending ? "Working..." : confirmLabel}
          </Button>
        </div>
      }
      onClose={onClose}
      open={open}
      size="sm"
      title={title}
    >
      {children}
    </Modal>
  );
}
