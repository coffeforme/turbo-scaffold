import { useAuthSession } from "@repo/auth";
import { BarChart, Card, DonutChart, Header, Table, Text } from "@repo/ui";
import styles from "./Dashboard.module.scss";

const activityRows = [
  { metric: "Views", count: 184 },
  { metric: "Uploads", count: 37 },
  { metric: "Creations", count: 19 },
];

const Dashboard = () => {
  const { session } = useAuthSession();

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <Header title="Dashboard" />
        <Text tone="muted">
          Welcome back {session?.user?.name ?? session?.user?.email ?? "workspace member"}.
          This dashboard is available when the session includes the `view` permission.
        </Text>
      </div>

      <div className={styles.stats}>
        <Card eyebrow="Sessions" title="Active access">
          <span className={styles.statValue}>{session?.user?.permissions?.length ?? 0}</span>
          <Text tone="muted">permissions available in the current session</Text>
        </Card>
        <Card eyebrow="Role" title="Primary role">
          <span className={styles.statValue}>{session?.user?.roles?.[0] ?? "guest"}</span>
          <Text tone="muted">first resolved role from the authorization claims</Text>
        </Card>
        <Card eyebrow="Provider" title="Session source">
          <span className={styles.statValue}>{session?.provider ?? "none"}</span>
          <Text tone="muted">normalized provider name driving this authenticated view</Text>
        </Card>
      </div>

      <div className={styles.grid}>
        <Card
          description="A simple chart organism to show operational totals."
          eyebrow="Organism"
          title="Team Activity"
        >
          <BarChart
            items={[
              { label: "Views", value: 184, tone: "primary" },
              { label: "Uploads", value: 37, tone: "accent" },
              { label: "Creates", value: 19, tone: "neutral" },
            ]}
          />
        </Card>

        <Card
          description="Current permission distribution in the signed-in session."
          eyebrow="Organism"
          title="Permission Mix"
        >
          <DonutChart
            segments={[
              { label: "View", value: session?.user?.permissions?.includes("view") ? 1 : 0, color: "#0f766e" },
              { label: "Upload", value: session?.user?.permissions?.includes("upload") ? 1 : 0, color: "#f59e0b" },
              { label: "Create", value: session?.user?.permissions?.includes("create") ? 1 : 0, color: "#334155" },
              { label: "Delete", value: session?.user?.permissions?.includes("delete") ? 1 : 0, color: "#b91c1c" },
            ]}
            title="Permission coverage"
            totalLabel="Granted"
          />
        </Card>
      </div>

      <Card
        description="A table view complements the charts for straightforward operational summaries."
        eyebrow="Overview"
        title="Activity Totals"
      >
        <Table
          caption="Recent workspace activity totals"
          columns={[
            { header: "Metric", key: "metric" },
            { header: "Count", key: "count", align: "right" },
          ]}
          rows={activityRows}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
