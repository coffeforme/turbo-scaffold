import { useState } from "react";
import { useAuthSession } from "@repo/auth";
import { ceilMinutes } from "@repo/math/ceilMinutes";
import { Button } from "@repo/ui";
import styles from "./AuthIdlePrompt.module.scss";

export function AuthIdlePrompt() {
  const { idleWarning, continueSession, signOutNow } = useAuthSession();
  const [submitting, setSubmitting] = useState(false);

  if (!idleWarning.isOpen) {
    return null;
  }

  const remainingMinutes = ceilMinutes(idleWarning.remainingMs);

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
    <aside className={styles.prompt}>
      <h3 className={styles.title}>Session expiring soon</h3>
      <p className={styles.message}>
        Your session will close in about {remainingMinutes} minute{remainingMinutes === 1 ? "" : "s"} because the app
        has been idle. Continue the session to stay signed in.
      </p>
      <div className={styles.actions}>
        <Button disabled={submitting} onClick={handleContinue}>
          Continue Session
        </Button>
        <Button className={styles.secondaryAction} disabled={submitting} onClick={handleSignOut}>
          Sign Out Now
        </Button>
      </div>
    </aside>
  );
}
