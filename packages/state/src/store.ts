import { configureStore } from "@reduxjs/toolkit";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import counterReducer from "./slices/counterSlice";
import userReducer from "./slices/userSlice";
import contactReducer from "./slices/contactSlice";
import feedbackReducer from "./slices/feedbackSlice";

// Types
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface FeedbackFormData {
  rating: number;
  comment: string;
  category: string;
}

export interface ContactState {
  submitting: boolean;
  submitted: boolean;
  error: string | null;
}

export interface FeedbackState {
  submitting: boolean;
  submitted: boolean;
  error: string | null;
}

export interface UserState {
  user: any;
  loading: boolean;
  error: string | null;
}

export interface CounterState {
  value: number;
}

// Define the state structure
export interface RootState {
  counter: CounterState;
  user: UserState;
  contact: ContactState;
  feedback: FeedbackState;
}

// Redux Store
export const reduxStore = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    contact: contactReducer,
    feedback: feedbackReducer,
  },
});

// Zustand Store
export const useZustandStore = create<RootState>()(
  subscribeWithSelector((set) => ({
    // Initial state
    counter: { value: 0 },
    user: { user: null, loading: false, error: null },
    contact: { submitting: false, submitted: false, error: null },
    feedback: { submitting: false, submitted: false, error: null },
  }))
);

// Action dispatchers for Zustand (for backward compatibility)
export const zustandDispatch = (action: any) => {
  switch (action.type) {
    case 'counter/increment':
      useZustandStore.setState((state) => ({
        counter: { ...state.counter, value: state.counter.value + 1 }
      }));
      break;
    case 'counter/decrement':
      useZustandStore.setState((state) => ({
        counter: { ...state.counter, value: state.counter.value - 1 }
      }));
      break;
    case 'contact/submitContactStart':
      useZustandStore.setState((state) => ({
        contact: { ...state.contact, submitting: true, error: null }
      }));
      break;
    case 'contact/submitContactSuccess':
      useZustandStore.setState((state) => ({
        contact: { ...state.contact, submitting: false, submitted: true }
      }));
      break;
    case 'contact/submitContactFailure':
      useZustandStore.setState((state) => ({
        contact: { ...state.contact, submitting: false, error: action.payload }
      }));
      break;
    case 'contact/resetContactForm':
      useZustandStore.setState((state) => ({
        contact: { submitting: false, submitted: false, error: null }
      }));
      break;
    case 'feedback/submitFeedbackStart':
      useZustandStore.setState((state) => ({
        feedback: { ...state.feedback, submitting: true, error: null }
      }));
      break;
    case 'feedback/submitFeedbackSuccess':
      useZustandStore.setState((state) => ({
        feedback: { ...state.feedback, submitting: false, submitted: true }
      }));
      break;
    case 'feedback/submitFeedbackFailure':
      useZustandStore.setState((state) => ({
        feedback: { ...state.feedback, submitting: false, error: action.payload }
      }));
      break;
    case 'feedback/resetFeedbackForm':
      useZustandStore.setState((state) => ({
        feedback: { submitting: false, submitted: false, error: null }
      }));
      break;
    default:
      console.warn('Unknown action:', action);
  }
};

// For backward compatibility
export const zustandStore = {
  getState: () => useZustandStore.getState(),
  dispatch: zustandDispatch,
};

// Action creators for backward compatibility
export const submitContactStart = () => ({ type: 'contact/submitContactStart' } as const);
export const submitContactSuccess = () => ({ type: 'contact/submitContactSuccess' } as const);
export const submitContactFailure = (error: string) => ({ type: 'contact/submitContactFailure', payload: error } as const);
export const resetContactForm = () => ({ type: 'contact/resetContactForm' } as const);

export const submitFeedbackStart = () => ({ type: 'feedback/submitFeedbackStart' } as const);
export const submitFeedbackSuccess = () => ({ type: 'feedback/submitFeedbackSuccess' } as const);
export const submitFeedbackFailure = (error: string) => ({ type: 'feedback/submitFeedbackFailure', payload: error } as const);
export const resetFeedbackForm = () => ({ type: 'feedback/resetFeedbackForm' } as const);

// Type definitions for compatibility
export type AppDispatch = typeof reduxStore.dispatch;