import { useState } from "react";
import {
  Button,
  Card,
  ConfirmDialog,
  Header,
  HierarchyTable,
  Input,
  Label,
  Modal,
  Select,
  Table,
  Text,
  Textarea,
} from "@repo/ui";
import styles from "./Components.module.scss";

type TeamRow = {
  name: string;
  role: string;
  permission: string;
};

type HierarchyRow = {
  id: string;
  name: string;
  type: string;
  owner: string;
  children?: HierarchyRow[];
};

const teamRows: TeamRow[] = [
  { name: "Ada Lovelace", role: "Admin", permission: "delete" },
  { name: "Grace Hopper", role: "Maintainer", permission: "upload" },
  { name: "Linus Torvalds", role: "Viewer", permission: "view" },
];

const hierarchyRows: HierarchyRow[] = [
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
      {
        id: "team-beta",
        name: "Team Beta",
        type: "Team",
        owner: "Linus",
      },
    ],
  },
];

const ComponentsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <Header title="Components" />
        <Text tone="muted">
          This page surfaces the current shared atoms, molecules, organisms, and mechanisms from `@repo/ui`.
        </Text>
      </div>

      <div className={styles.grid}>
        <Card
          description="Inputs, labels, text, and buttons establish the shared form baseline."
          eyebrow="Atoms"
          title="Form Primitives"
        >
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <Label htmlFor="component-name">Name</Label>
              <Input id="component-name" placeholder="Workspace user" />
            </div>
            <div className={styles.field}>
              <Label htmlFor="component-role">Role</Label>
              <Select id="component-role" defaultValue="admin">
                <option value="admin">Admin</option>
                <option value="maintainer">Maintainer</option>
                <option value="viewer">Viewer</option>
              </Select>
            </div>
            <div className={styles.field}>
              <Label htmlFor="component-notes">Notes</Label>
              <Textarea id="component-notes" rows={4} defaultValue="Shared primitives now style the full form baseline." />
            </div>
            <div className={styles.actions}>
              <Button>Primary Action</Button>
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Button onClick={() => setConfirmOpen(true)}>Open Confirm</Button>
            </div>
          </div>
        </Card>

        <Card
          description="Cards and tables give us fast, reusable content and data presentation surfaces."
          eyebrow="Molecules"
          title="Data Surfaces"
        >
          <Table
            caption="Current demo roles and permissions"
            columns={[
              { header: "Name", key: "name" },
              { header: "Role", key: "role" },
              { header: "Permission", key: "permission" },
            ]}
            rows={teamRows}
          />
        </Card>
      </div>

      <Card
        description="Hierarchy tables help represent tree-shaped data like organizations, folders, or permission inheritance."
        eyebrow="Organisms"
        title="Hierarchy Table"
      >
        <HierarchyTable
          columns={[
            { header: "Node", render: (row) => row.name },
            { header: "Type", render: (row) => row.type },
            { header: "Owner", render: (row) => row.owner },
          ]}
          rows={hierarchyRows}
        />
      </Card>

      <Card
        description="Mechanisms encapsulate richer interactive logic like overlays, dismiss behavior, confirmations, and event orchestration."
        eyebrow="Mechanisms"
        title="Interaction Systems"
      >
        <div className={styles.actions}>
          <Button onClick={() => setModalOpen(true)}>Show Rich Modal</Button>
          <Button onClick={() => setConfirmOpen(true)}>Show Confirmation</Button>
        </div>
        <Text tone="muted">
          Use mechanisms when a component needs more than presentation, such as click-outside close, keyboard dismissal, or action coordination.
        </Text>
      </Card>

      <Modal
        description="This mechanism can render simple text or complex children and handles overlay close, escape close, and explicit dismissal."
        footer={<Button onClick={() => setModalOpen(false)}>Close</Button>}
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        title="Rich Modal Mechanism"
      >
        <Text>
          The modal mechanism is designed for richer system behavior rather than only a static shell. It supports interaction rules and can host forms, previews, or detail panes.
        </Text>
      </Modal>

      <ConfirmDialog
        confirmLabel={confirmed ? "Confirmed" : "Confirm Action"}
        description="This confirmation mechanism wraps the modal with a focused decision flow."
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmed(true);
          setConfirmOpen(false);
        }}
        open={confirmOpen}
        title="Confirm Component Action"
      >
        <Text tone="muted">Choose confirm to simulate a protected component action.</Text>
      </ConfirmDialog>
    </div>
  );
};

export default ComponentsPage;
