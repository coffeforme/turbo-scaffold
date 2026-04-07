import type {
  ContactFormData,
  ContactState,
  FeedbackFormData,
  FeedbackState,
  RootState,
  UserState,
} from "./types";

export interface StateManager {
  getState(): RootState;

  getCounterValue(): number;
  incrementCounter(): void;
  decrementCounter(): void;

  getContactFormData(): ContactFormData;
  updateContactField(field: keyof ContactFormData, value: string): void;
  getContactState(): ContactState;
  submitContactStart(): void;
  submitContactSuccess(): void;
  submitContactFailure(error: string): void;
  resetContactForm(): void;

  getFeedbackFormData(): FeedbackFormData;
  updateFeedbackField(field: keyof FeedbackFormData, value: string | number): void;
  getFeedbackState(): FeedbackState;
  submitFeedbackStart(): void;
  submitFeedbackSuccess(): void;
  submitFeedbackFailure(error: string): void;
  resetFeedbackForm(): void;

  getUserState(): UserState;
  setUser(user: any): void;
  setUserLoading(loading: boolean): void;
  setUserError(error: string): void;
  clearUser(): void;
}

export type StateManagerType = "redux" | "zustand";
