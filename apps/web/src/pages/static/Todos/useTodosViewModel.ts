import { useTodosStore } from "@repo/state";
import { useMemo } from "react";

export function useTodosViewModel() {
  const draft = useTodosStore((state) => state.draft);
  const items = useTodosStore((state) => state.items);
  const pendingDeleteId = useTodosStore((state) => state.pendingDeleteId);
  const updateDraft = useTodosStore((state) => state.updateDraft);
  const addTodo = useTodosStore((state) => state.addTodo);
  const toggleTodo = useTodosStore((state) => state.toggleTodo);
  const requestDelete = useTodosStore((state) => state.requestDelete);
  const cancelDelete = useTodosStore((state) => state.cancelDelete);
  const confirmDelete = useTodosStore((state) => state.confirmDelete);
  const clearCompleted = useTodosStore((state) => state.clearCompleted);

  const metrics = useMemo(() => {
    const total = items.length;
    const completed = items.filter((item) => item.done).length;
    const open = total - completed;

    return { total, completed, open };
  }, [items]);

  const pendingDeleteItem = items.find((item) => item.id === pendingDeleteId) ?? null;

  return {
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
  };
}
