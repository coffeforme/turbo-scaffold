// Redux exports
export { reduxStore } from "./store";
export * from "./slices/counterSlice";
export * from "./slices/userSlice";
export * from "./slices/contactSlice";
export * from "./slices/feedbackSlice";

// Zustand exports
export { useZustandStore, zustandStore, zustandDispatch } from "./store";
export { useZustandDispatch, useZustandSelector } from "./hooks";

// Unified exports (Redux by default for backward compatibility)
export { useAppDispatch, useAppSelector, useDispatch, useSelector } from "./hooks";
export * from "./selectors";

// Agnostic State Management (Recommended)
export type { StateManager, StateManagerType } from "./managers/StateManager";
export { StateManagerFactory } from "./managers/StateManagerFactory";
export { getStateManager, getCurrentManagerType, setStateManagerType, initializeStateManager } from "./managers/StateManagerProvider";
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

// Types
export type { RootState, AppDispatch } from "./store";
export type { ContactFormData, FeedbackFormData } from "./store";
export type { UserState, ContactState, FeedbackState } from "./store";