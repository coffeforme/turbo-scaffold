import type { StateManager } from "../shared/StateManager";
import type { ContactFormData, FeedbackFormData } from "../shared/types";
import { reduxStore } from "./store";
import { increment, decrement } from "./slices/counterSlice";
import { setUser, setLoading, setError, clearUser } from "./slices/userSlice";
import {
  updateContactField,
  submitContactStart,
  submitContactSuccess,
  submitContactFailure,
  resetContactForm,
} from "./slices/contactSlice";
import {
  updateFeedbackField,
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

  getContactFormData() {
    return reduxStore.getState().contact.formData;
  }

  updateContactField(field: keyof ContactFormData, value: string): void {
    reduxStore.dispatch(updateContactField({ field, value }));
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

  getFeedbackFormData() {
    return reduxStore.getState().feedback.formData;
  }

  updateFeedbackField(field: keyof FeedbackFormData, value: string | number): void {
    reduxStore.dispatch(updateFeedbackField({ field, value }));
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
