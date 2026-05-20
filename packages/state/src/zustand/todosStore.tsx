import { createContext, useContext, useRef, type PropsWithChildren } from "react";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

export type TodoPriority = "low" | "medium" | "high";

export interface TodoItem extends Record<string, unknown> {
  id: string;
  title: string;
  notes: string;
  priority: TodoPriority;
  done: boolean;
  createdAt: string;
}

export interface TodoDraft {
  title: string;
  notes: string;
  priority: TodoPriority;
}

interface TodosState {
  items: TodoItem[];
  draft: TodoDraft;
  pendingDeleteId: string | null;
  updateDraft: <K extends keyof TodoDraft>(field: K, value: TodoDraft[K]) => void;
  addTodo: () => boolean;
  toggleTodo: (todoId: string) => void;
  requestDelete: (todoId: string) => void;
  cancelDelete: () => void;
  confirmDelete: () => void;
  clearCompleted: () => void;
}

const INITIAL_DRAFT: TodoDraft = {
  title: "",
  notes: "",
  priority: "medium",
};

const createTodosStore = () =>
  createStore<TodosState>()((set, get) => ({
    items: [],
    draft: INITIAL_DRAFT,
    pendingDeleteId: null,
    updateDraft: (field, value) =>
      set((state) => ({
        draft: {
          ...state.draft,
          [field]: value,
        },
      })),
    addTodo: () => {
      const { draft, items } = get();
      const trimmedTitle = draft.title.trim();
      const trimmedNotes = draft.notes.trim();

      if (!trimmedTitle) {
        return false;
      }

      const nextTodo: TodoItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: trimmedTitle,
        notes: trimmedNotes,
        priority: draft.priority,
        done: false,
        createdAt: new Date().toISOString(),
      };

      set({
        items: [nextTodo, ...items],
        draft: INITIAL_DRAFT,
      });

      return true;
    },
    toggleTodo: (todoId) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.id === todoId
            ? {
                ...item,
                done: !item.done,
              }
            : item,
        ),
      })),
    requestDelete: (todoId) => set({ pendingDeleteId: todoId }),
    cancelDelete: () => set({ pendingDeleteId: null }),
    confirmDelete: () =>
      set((state) => ({
        items: state.items.filter((item) => item.id !== state.pendingDeleteId),
        pendingDeleteId: null,
      })),
    clearCompleted: () =>
      set((state) => ({
        items: state.items.filter((item) => !item.done),
      })),
  }));

type TodosStore = ReturnType<typeof createTodosStore>;

const TodosStoreContext = createContext<TodosStore | null>(null);

export function TodosStoreProvider({ children }: PropsWithChildren) {
  const storeRef = useRef<TodosStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createTodosStore();
  }

  return <TodosStoreContext.Provider value={storeRef.current}>{children}</TodosStoreContext.Provider>;
}

export function useTodosStore<T>(selector: (state: TodosState) => T) {
  const store = useContext(TodosStoreContext);

  if (!store) {
    throw new Error("useTodosStore must be used within a TodosStoreProvider");
  }

  return useStore(store, selector);
}
