import { useAuthSession } from "@repo/auth";
import { Card, Header, Text } from "@repo/ui";
import styles from "./Profile.module.scss";

const Profile = () => {
  const { session } = useAuthSession();

  return (
    <div className={styles.page}>
      <Header title="Profile" />

      <div className={styles.meta}>
        <Card eyebrow="Identity" title={session?.user?.name ?? "Unknown user"}>
          <Text tone="muted">{session?.user?.email ?? "No email available"}</Text>
        </Card>
        <Card eyebrow="Provider" title={session?.provider ?? "No provider"}>
          <Text tone="muted">Signed in through the shared normalized auth session.</Text>
        </Card>
      </div>

      <Card eyebrow="Claims" title="Access summary">
        <Text>Roles: {session?.user?.roles?.join(", ") || "None"}</Text>
        <Text>Permissions: {session?.user?.permissions?.join(", ") || "None"}</Text>
      </Card>
    </div>
  );
};

export default Profile;
