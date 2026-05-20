import { useState } from "react";
import { useAuthSession } from "@repo/auth";
import { ConfirmDialog, Text } from "@repo/ui";

function formatRemainingTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function AuthIdlePrompt() {
  const { idleWarning, continueSession, signOutNow } = useAuthSession();
  const [submitting, setSubmitting] = useState(false);

  if (!idleWarning.isOpen) {
    return null;
  }

  const remainingTime = formatRemainingTime(idleWarning.remainingMs);

  const handleContinue = async () => {
    setSubmitting(true);
    await continueSession();
    setSubmitting(false);
  };

  const handleSignOut = async () => {
    setSubmitting(true);
    await signOutNow();
    setSubmitting(false);
  };

  return (
    <ConfirmDialog
      backdropMode="blur"
      cancelLabel="Sign Out Now"
      confirmLabel="Continue Session"
      description="Your session is about to expire because the app has been idle."
      onClose={handleSignOut}
      onConfirm={handleContinue}
      open={idleWarning.isOpen}
      pending={submitting}
      title="Session expiring soon"
    >
      <Text tone="muted">
        The current session will close in <strong>{remainingTime}</strong>. Continue the session to stay signed in.
      </Text>
    </ConfirmDialog>
  );
}
