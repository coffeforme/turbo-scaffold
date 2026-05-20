export * from "./redux";
export * from "./zustand";
export * from "./shared/selectors";
export { TodosStoreProvider, useTodosStore } from "./zustand/todosStore";

export type { StateManager, StateManagerType } from "./shared/StateManager";
export type {
  RootState,
  CounterState,
  UserState,
  ContactState,
  FeedbackState,
  ContactFormData,
  FeedbackFormData,
} from "./shared/types";
export type { TodoItem, TodoDraft, TodoPriority } from "./zustand/todosStore";

export { StateManagerFactory } from "./managers/StateManagerFactory";
export {
  getStateManager,
  getCurrentManagerType,
  setStateManagerType,
  initializeStateManager,
} from "./managers/StateManagerProvider";
export {
  useAgnosticCounter,
  useAgnosticContactForm,
  useAgnosticFeedbackForm,
  useAgnosticUser,
} from "./managers/hooks";
export type {
  UseAgnosticContactFormConfig,
  UseAgnosticFeedbackFormConfig,
} from "./managers/hooks";
