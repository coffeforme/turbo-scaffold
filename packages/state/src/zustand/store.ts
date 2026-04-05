import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { createInitialRootState } from "../shared/types";
import type { RootState } from "../shared/types";

export const useZustandStore = create<RootState>()(
  subscribeWithSelector(() => createInitialRootState()),
);

export const zustandDispatch = (action: { type: string; payload?: unknown }) => {
  switch (action.type) {
    case "counter/increment":
      useZustandStore.setState((state) => ({
        counter: { ...state.counter, value: state.counter.value + 1 },
      }));
      break;
    case "counter/decrement":
      useZustandStore.setState((state) => ({
        counter: { ...state.counter, value: state.counter.value - 1 },
      }));
      break;
    case "contact/submitContactStart":
      useZustandStore.setState((state) => ({
        contact: { ...state.contact, submitting: true, error: null },
      }));
      break;
    case "contact/submitContactSuccess":
      useZustandStore.setState((state) => ({
        contact: { ...state.contact, submitting: false, submitted: true },
      }));
      break;
    case "contact/submitContactFailure":
      useZustandStore.setState((state) => ({
        contact: { ...state.contact, submitting: false, error: action.payload as string },
      }));
      break;
    case "contact/resetContactForm":
      useZustandStore.setState((state) => ({
        contact: { ...state.contact, submitting: false, submitted: false, error: null },
      }));
      break;
    case "feedback/submitFeedbackStart":
      useZustandStore.setState((state) => ({
        feedback: { ...state.feedback, submitting: true, error: null },
      }));
      break;
    case "feedback/submitFeedbackSuccess":
      useZustandStore.setState((state) => ({
        feedback: { ...state.feedback, submitting: false, submitted: true },
      }));
      break;
    case "feedback/submitFeedbackFailure":
      useZustandStore.setState((state) => ({
        feedback: { ...state.feedback, submitting: false, error: action.payload as string },
      }));
      break;
    case "feedback/resetFeedbackForm":
      useZustandStore.setState((state) => ({
        feedback: { ...state.feedback, submitting: false, submitted: false, error: null },
      }));
      break;
    default:
      console.warn("Unknown action:", action);
  }
};

export const zustandStore = {
  getState: () => useZustandStore.getState(),
  dispatch: zustandDispatch,
};
