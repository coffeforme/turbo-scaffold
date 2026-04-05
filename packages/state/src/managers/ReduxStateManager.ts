import { StateManager } from './StateManager';
import { reduxStore } from '../store';
import {
  increment,
  decrement,
} from '../slices/counterSlice';
import {
  setUser,
  setLoading,
  setError,
  clearUser,
} from '../slices/userSlice';
import {
  submitContactStart,
  submitContactSuccess,
  submitContactFailure,
  resetContactForm,
} from '../slices/contactSlice';
import {
  submitFeedbackStart,
  submitFeedbackSuccess,
  submitFeedbackFailure,
  resetFeedbackForm,
} from '../slices/feedbackSlice';
import type { RootState } from '../store';

export class ReduxStateManager implements StateManager {
  // Counter operations
  getCounterValue(): number {
    return reduxStore.getState().counter.value;
  }

  incrementCounter(): void {
    reduxStore.dispatch(increment());
  }

  decrementCounter(): void {
    reduxStore.dispatch(decrement());
  }

  // Contact form operations
  getContactState() {
    const state = reduxStore.getState().contact;
    return {
      submitting: state.submitting,
      submitted: state.submitted,
      error: state.error,
    };
  }

  submitContactStart(): void {
    reduxStore.dispatch(submitContactStart());
  }

  submitContactSuccess(): void {
    reduxStore.dispatch(submitContactSuccess());
  }

  submitContactFailure(error: string): void {
    reduxStore.dispatch(submitContactFailure(error));
  }

  resetContactForm(): void {
    reduxStore.dispatch(resetContactForm());
  }

  // Feedback form operations
  getFeedbackState() {
    const state = reduxStore.getState().feedback;
    return {
      submitting: state.submitting,
      submitted: state.submitted,
      error: state.error,
    };
  }

  submitFeedbackStart(): void {
    reduxStore.dispatch(submitFeedbackStart());
  }

  submitFeedbackSuccess(): void {
    reduxStore.dispatch(submitFeedbackSuccess());
  }

  submitFeedbackFailure(error: string): void {
    reduxStore.dispatch(submitFeedbackFailure(error));
  }

  resetFeedbackForm(): void {
    reduxStore.dispatch(resetFeedbackForm());
  }

  // User operations
  getUserState() {
    const state = reduxStore.getState().user;
    return {
      user: state.user,
      loading: state.loading,
      error: state.error,
    };
  }

  setUser(user: any): void {
    reduxStore.dispatch(setUser(user));
  }

  setUserLoading(loading: boolean): void {
    reduxStore.dispatch(setLoading(loading));
  }

  setUserError(error: string): void {
    reduxStore.dispatch(setError(error));
  }

  clearUser(): void {
    reduxStore.dispatch(clearUser());
  }
}