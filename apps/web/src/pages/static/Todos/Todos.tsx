import { AccessRight } from "@repo/auth";
import { TodosStoreProvider, type TodoItem } from "@repo/state";
import {
  Button,
  Card,
  ConfirmDialog,
  FlipContainer,
  Header,
  Input,
  Label,
  MarkdownContent,
  Select,
  Table,
  Text,
  Textarea,
  useUploadManager,
} from "@repo/ui";
import type { TableColumn } from "@repo/ui";
import { useTodosViewModel } from "./useTodosViewModel";
import styles from "./Todos.module.scss";

const implementationMarkdown = `## MVVM Implementation

This page keeps orchestration in the \`ViewModel\` while the view stays focused on composition.

\`\`\`ts
const draft = useTodosStore((state) => state.draft);
const addTodo = useTodosStore((state) => state.addTodo);
const requestDelete = useTodosStore((state) => state.requestDelete);
\`\`\`

\`\`\`tsx
<AccessRight effect="disable" permissions={["create"]}>
  <Button onClick={addTodo}>Create Todo</Button>
</AccessRight>

<AccessRight effect="disable" permissions={["upload"]}>
  <Button onClick={openUploadPicker}>Upload Asset</Button>
</AccessRight>
\`\`\``;

const mvvmPatternMarkdown = `## MVVM Pattern

- \`useTodosViewModel.ts\` keeps page behavior out of the JSX view.
- \`TodosStoreProvider\` in \`@repo/state\` owns a dedicated Zustand store for this page.
- \`useTodosStore(...)\` exposes draft state, task items, and mutations.
- \`@repo/ui\` provides the form atoms, cards, table, dialog, and flip-container shell.
- \`AccessRight\` from \`@repo/auth\` disables actions instead of branching the whole UI.
- \`useUploadManager()\` triggers the shared upload mechanism with page/section metadata.

\`\`\`ts
const draft = useTodosStore((state) => state.draft);
const items = useTodosStore((state) => state.items);
const addTodo = useTodosStore((state) => state.addTodo);
const clearCompleted = useTodosStore((state) => state.clearCompleted);
\`\`\`

\`\`\`tsx
<AccessRight effect="disable" permissions={["create"]}>
  <Button onClick={addTodo}>Create Todo</Button>
</AccessRight>
\`\`\``;

function TodoPriorityBadge({ priority }: { priority: TodoItem["priority"] }) {
  const className =
    priority === "high"
      ? `${styles.priority} ${styles.priorityHigh}`
      : priority === "medium"
        ? `${styles.priority} ${styles.priorityMedium}`
        : `${styles.priority} ${styles.priorityLow}`;

  return <span className={className}>{priority}</span>;
}

function TodoStatusBadge({ done }: { done: boolean }) {
  return <span className={done ? `${styles.status} ${styles.statusDone}` : `${styles.status} ${styles.statusOpen}`}>{done ? "Done" : "Open"}</span>;
}

const columns = (
  onToggle: (todoId: string) => void,
  onDelete: (todoId: string) => void,
): TableColumn<TodoItem>[] => [
  {
    header: "Task",
    key: "title",
    render: (row) => (
      <div className={styles.stack}>
        <Text as="strong" weight="strong">
          {row.title}
        </Text>
        <Text size="sm" tone="muted">
          {row.notes || "No notes added yet."}
        </Text>
      </div>
    ),
  },
  {
    header: "Priority",
    key: "priority",
    render: (row) => <TodoPriorityBadge priority={row.priority} />,
    align: "center",
  },
  {
    header: "Status",
    key: "done",
    render: (row) => <TodoStatusBadge done={row.done} />,
    align: "center",
  },
  {
    header: "Actions",
    key: "actions",
    render: (row) => (
      <div className={styles.rowActions}>
        <Button className={styles.secondaryButton} onClick={() => onToggle(row.id)}>
          {row.done ? "Reopen" : "Complete"}
        </Button>
        <AccessRight effect="disable" permissions={["delete"]}>
          <Button className={styles.dangerButton} onClick={() => onDelete(row.id)}>
            Delete
          </Button>
        </AccessRight>
      </div>
    ),
  },
];

function TodosPageContent() {
  const { openUploadPicker } = useUploadManager();
  const {
    draft,
    items,
    metrics,
    pendingDeleteItem,
    updateDraft,
    addTodo,
    toggleTodo,
    requestDelete,
    cancelDelete,
    confirmDelete,
    clearCompleted,
  } = useTodosViewModel();

  const handleCreate = () => {
    addTodo();
  };

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <Header title="TODOs" />
        <Text tone="muted">
          This page is a small MVVM-style reference: the page stays presentational, the `ViewModel` owns behavior,
          Zustand keeps the task state in memory, and permissions can disable actions without rewriting the UI.
        </Text>
      </div>

      <div className={styles.metricGrid}>
        <div className={styles.metricCard}>
          <Text size="sm" tone="muted">
            Total
          </Text>
          <span className={styles.metricValue}>{metrics.total}</span>
        </div>
        <div className={styles.metricCard}>
          <Text size="sm" tone="muted">
            Open
          </Text>
          <span className={styles.metricValue}>{metrics.open}</span>
        </div>
        <div className={styles.metricCard}>
          <Text size="sm" tone="muted">
            Completed
          </Text>
          <span className={styles.metricValue}>{metrics.completed}</span>
        </div>
      </div>

      <div className={styles.grid}>
        <FlipContainer
          title="Pattern Example"
          description="This example combines a local ViewModel, shared UI artifacts, a dedicated Zustand provider, and auth-aware action gating."
          front={
            <Card
              eyebrow="ViewModel + Packages"
              title="Create and Manage Tasks"
              description="Use this as a small pattern reference when adding pages that need workflow state owned by a dedicated Zustand provider without committing immediately to shared global state."
            >
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <Label htmlFor="todo-title">Title</Label>
                  <Input
                    id="todo-title"
                    placeholder="Ship the upload flow"
                    value={draft.title}
                    onChange={(event) => updateDraft("title", event.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <Label htmlFor="todo-priority">Priority</Label>
                  <Select
                    id="todo-priority"
                    value={draft.priority}
                    onChange={(event) => updateDraft("priority", event.target.value as TodoItem["priority"])}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </div>
                <div className={styles.field}>
                  <Label htmlFor="todo-notes">Notes</Label>
                  <Textarea
                    id="todo-notes"
                    rows={4}
                    placeholder="Capture the implementation detail or next action."
                    value={draft.notes}
                    onChange={(event) => updateDraft("notes", event.target.value)}
                  />
                </div>
                <div className={styles.actions}>
                  <AccessRight effect="disable" permissions={["create"]}>
                    <Button onClick={handleCreate}>Create Todo</Button>
                  </AccessRight>
                  <AccessRight effect="disable" permissions={["upload"]}>
                    <Button
                      className={styles.secondaryButton}
                      onClick={() =>
                        openUploadPicker({
                          source: {
                            page: "TODOs",
                            section: "Task Assets",
                          },
                        })
                      }
                    >
                      Upload Asset
                    </Button>
                  </AccessRight>
                  <AccessRight effect="disable" permissions={["delete"]}>
                    <Button className={styles.dangerButton} onClick={clearCompleted}>
                      Clear Completed
                    </Button>
                  </AccessRight>
                </div>
                <Text className={styles.helper} size="sm" tone="muted">
                  Sign in with permissions like `create`, `upload`, or `delete` to enable the protected actions.
                </Text>
              </div>
            </Card>
          }
          back={<MarkdownContent className={styles.markdownBlock} markdown={implementationMarkdown} />}
        />

        <Card
          eyebrow="MVVM Pattern"
          title="What This Example Uses"
          description="A small implementation map for developers onboarding into the repo patterns."
        >
          <MarkdownContent className={styles.markdownBlock} markdown={mvvmPatternMarkdown} />
        </Card>
      </div>

      <Card
        eyebrow="Current Tasks"
        title="Task Board"
        description="A simple board showing how the shared table can stay presentational while action rules and Zustand-owned page state live outside it."
      >
        <Table
          caption="Local TODO examples"
          columns={columns(toggleTodo, requestDelete)}
          emptyMessage="No tasks yet. Add one from the form above."
          rows={items}
        />
      </Card>

      <ConfirmDialog
        open={Boolean(pendingDeleteItem)}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete todo?"
        description="This action removes the selected task from the current in-memory Zustand store."
        confirmLabel="Delete Task"
        backdropMode="transparent"
      >
        <Text tone="muted">
          {pendingDeleteItem ? `Remove "${pendingDeleteItem.title}" from the TODO board?` : "Choose a task to remove."}
        </Text>
      </ConfirmDialog>
    </div>
  );
}

const TodosPage = () => (
  <TodosStoreProvider>
    <TodosPageContent />
  </TodosStoreProvider>
);

export default TodosPage;
