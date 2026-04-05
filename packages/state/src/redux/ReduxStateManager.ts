import type { StateManager } from "../shared/StateManager";
import { reduxStore } from "./store";
import { increment, decrement } from "./slices/counterSlice";
import { setUser, setLoading, setError, clearUser } from "./slices/userSlice";
import {
  submitContactStart,
  submitContactSuccess,
  submitContactFailure,
  resetContactForm,
} from "./slices/contactSlice";
import {
  submitFeedbackStart,
  submitFeedbackSuccess,
  submitFeedbackFailure,
  resetFeedbackForm,
} from "./slices/feedbackSlice";

export class ReduxStateManager implements StateManager {
  getState() {
    return reduxStore.getState();
  }

  getCounterValue(): number {
    return reduxStore.getState().counter.value;
  }

  incrementCounter(): void {
    reduxStore.dispatch(increment());
  }

  decrementCounter(): void {
    reduxStore.dispatch(decrement());
  }

  getContactState() {
    return reduxStore.getState().contact;
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

  getFeedbackState() {
    return reduxStore.getState().feedback;
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

  getUserState() {
    return reduxStore.getState().user;
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
