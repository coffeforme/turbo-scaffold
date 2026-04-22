import { useState } from "react";
import {
  BarChart,
  Button,
  Card,
  ConfirmDialog,
  DonutChart,
  FlipContainer,
  Header,
  HierarchyTable,
  Input,
  Label,
  Modal,
  Rating,
  Select,
  Table,
  Text,
  Textarea,
  UploadInput,
  UploadManagerPanel,
  useUploadManager,
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

type ModalVariant = "blur" | "plain" | "transparent" | "custom";

const primitivesCode = `const [rating, setRating] = useState(4);

<Input id="component-name" placeholder="Workspace user" />
<Select id="component-role" defaultValue="admin" />
<Textarea id="component-notes" rows={4} />
<UploadInput label="Attach files" multiple />
<Rating value={rating} onChange={setRating} />`;

const surfacesCode = `<Table rows={teamRows} />

<BarChart
  items={[
    { label: "Views", value: 184, tone: "primary" },
    { label: "Uploads", value: 37, tone: "accent" },
  ]}
/>

<DonutChart title="Permission coverage" segments={segments} />`;

const hierarchyCode = `<HierarchyTable
  columns={[
    { header: "Node", render: (row) => row.name },
    { header: "Type", render: (row) => row.type },
    { header: "Owner", render: (row) => row.owner },
  ]}
  rows={hierarchyRows}
  defaultExpandedIds={["workspace"]}
/>`;

const mechanismsCode = `<Modal backdropMode="blur" open={modalOpen} />
<Modal backdropMode="transparent" open={modalOpen} />
<Modal backdropMode="plain" overlayOpacity={0.35} open={modalOpen} />

<ConfirmDialog backdropMode="transparent" open={confirmOpen} />

<UploadManagerPanel viewType="resumeView" />
<UploadManagerPanel viewType="minimizedView" />

openUploadPicker({
  source: {
    page: "Components",
    section: "Upload Manager Demo",
  },
});`;

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
          {
            id: "design-reviews",
            name: "Design Reviews",
            type: "Process",
            owner: "Ada",
          },
        ],
      },
      {
        id: "team-beta",
        name: "Team Beta",
        type: "Team",
        owner: "Linus",
        children: [
          {
            id: "release-train",
            name: "Release Train",
            type: "Workflow",
            owner: "Linus",
          },
        ],
      },
    ],
  },
];

function CodePreview({ code }: { code: string }) {
  return <pre className={styles.codeBlock}>{code}</pre>;
}

const ComponentsPage = () => {
  const [modalVariant, setModalVariant] = useState<ModalVariant>("blur");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [rating, setRating] = useState(4);
  const { openUploadPicker, addUploads } = useUploadManager();

  const overlayOpacity = modalVariant === "custom" ? 0.3 : undefined;
  const backdropMode = modalVariant === "custom" ? "plain" : modalVariant;

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <Header title="Components" />
        <Text tone="muted">
          This page surfaces the current shared atoms, molecules, organisms, and mechanisms from `@repo/ui`.
          Each section can flip to its implementation snapshot.
        </Text>
      </div>

      <div className={styles.grid}>
        <FlipContainer
          back={<CodePreview code={primitivesCode} />}
          description="Inputs, labels, upload controls, and rating establish the shared interaction baseline."
          front={
            <Card
              description="Inputs, labels, upload controls, text, and buttons establish the shared form baseline."
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
                  <Textarea
                    defaultValue="Shared primitives now style the full form baseline."
                    id="component-notes"
                    rows={4}
                  />
                </div>
                <div className={styles.field}>
                  <UploadInput
                    helperText="Direct uploads can also be pushed into the shared upload manager."
                    label="Upload Files"
                    multiple
                    onChange={(event) => {
                      const files = Array.from(event.target.files ?? []);

                      if (files.length > 0) {
                        addUploads(files, {
                          page: "Components",
                          section: "Atoms",
                        });
                      }

                      event.target.value = "";
                    }}
                  />
                </div>
                <div className={styles.field}>
                  <Label htmlFor="component-rating">Experience Rating</Label>
                  <div className={styles.ratingRow}>
                    <Rating onChange={setRating} value={rating} />
                    <Text tone="muted">{rating}/5</Text>
                  </div>
                </div>
              </div>
            </Card>
          }
          title="Atoms"
        />

        <FlipContainer
          back={<CodePreview code={surfacesCode} />}
          description="Cards, tables, and charts provide reusable surfaces for structured content and dashboard metrics."
          front={
            <Card
              description="Cards, tables, and charts give us fast reusable content and data presentation surfaces."
              eyebrow="Molecules + Organisms"
              title="Data Surfaces"
            >
              <div className={styles.surfaceStack}>
                <Table
                  caption="Current demo roles and permissions"
                  columns={[
                    { header: "Name", key: "name" },
                    { header: "Role", key: "role" },
                    { header: "Permission", key: "permission" },
                  ]}
                  rows={teamRows}
                />
                <div className={styles.chartGrid}>
                  <BarChart
                    items={[
                      { label: "Views", value: 184, tone: "primary" },
                      { label: "Uploads", value: 37, tone: "accent" },
                      { label: "Creates", value: 19, tone: "neutral" },
                    ]}
                  />
                  <DonutChart
                    segments={[
                      { label: "View", value: 1, color: "#0f766e" },
                      { label: "Upload", value: 1, color: "#f59e0b" },
                      { label: "Delete", value: 0, color: "#b91c1c" },
                    ]}
                    title="Permission coverage"
                    totalLabel="Granted"
                  />
                </div>
              </div>
            </Card>
          }
          title="Data Surfaces"
        />
      </div>

      <FlipContainer
        back={<CodePreview code={hierarchyCode} />}
        description="Hierarchy tables now support expandable child nodes so teams, folders, or workflows can be explored progressively."
        front={
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
              defaultExpandedIds={["workspace"]}
              rows={hierarchyRows}
            />
          </Card>
        }
        title="Hierarchy Explorer"
      />

      <FlipContainer
        back={<CodePreview code={mechanismsCode} />}
        description="Mechanisms encapsulate richer event orchestration like uploads, overlays, dismissal rules, and confirmations."
        front={
          <Card
            description="Mechanisms handle richer interaction rules and shared system behavior."
            eyebrow="Mechanisms"
            title="Interaction Systems"
          >
            <div className={styles.mechanismStack}>
              <div className={styles.field}>
                <Label htmlFor="modal-variant">Backdrop Mode</Label>
                <Select
                  id="modal-variant"
                  value={modalVariant}
                  onChange={(event) => setModalVariant(event.target.value as ModalVariant)}
                >
                  <option value="blur">Blur</option>
                  <option value="transparent">Transparent</option>
                  <option value="plain">Plain</option>
                  <option value="custom">Custom Opacity</option>
                </Select>
              </div>

              <div className={styles.actions}>
                <Button onClick={() => setModalOpen(true)}>Show Modal Variant</Button>
                <Button onClick={() => setConfirmOpen(true)}>Show Confirmation</Button>
                <Button
                  onClick={() =>
                    openUploadPicker({
                      source: {
                        page: "Components",
                        section: "Upload Manager Demo",
                      },
                    })
                  }
                >
                  Trigger Upload Manager
                </Button>
              </div>

              <Text tone="muted">
                The upload manager is running globally with a Zustand-backed provider, so uploads triggered here remain
                visible from any page.
              </Text>

              <div className={styles.previewPanelWrap}>
                <UploadManagerPanel placement="inline" title="Resume View Preview" viewType="resumeView" />
              </div>
            </div>
          </Card>
        }
        title="Mechanisms"
      />

      <Modal
        backdropMode={backdropMode}
        description="This modal demonstrates switchable overlay behavior including blur, transparent, and custom-opacity modes."
        footer={<Button onClick={() => setModalOpen(false)}>Close</Button>}
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        overlayOpacity={overlayOpacity}
        title="Modal Backdrop Variant"
      >
        <Text>
          The current backdrop mode is <strong>{modalVariant}</strong>. This helps demonstrate how the modal can feel
          more atmospheric or more lightweight depending on context.
        </Text>
      </Modal>

      <ConfirmDialog
        backdropMode="transparent"
        confirmLabel={confirmed ? "Confirmed" : "Confirm Action"}
        description="This confirmation mechanism uses a transparent overlay to stay lighter-weight than the main modal."
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmed(true);
          setConfirmOpen(false);
        }}
        open={confirmOpen}
        overlayOpacity={0.22}
        title="Confirm Component Action"
      >
        <Text tone="muted">Choose confirm to simulate a protected component action.</Text>
      </ConfirmDialog>
    </div>
  );
};

export default ComponentsPage;
