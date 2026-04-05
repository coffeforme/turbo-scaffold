// State Manager Interface for Agnostic State Management
export interface StateManager {
  // Counter operations
  getCounterValue(): number;
  incrementCounter(): void;
  decrementCounter(): void;

  // Contact form operations
  getContactState(): { submitting: boolean; submitted: boolean; error: string | null };
  submitContactStart(): void;
  submitContactSuccess(): void;
  submitContactFailure(error: string): void;
  resetContactForm(): void;

  // Feedback form operations
  getFeedbackState(): { submitting: boolean; submitted: boolean; error: string | null };
  submitFeedbackStart(): void;
  submitFeedbackSuccess(): void;
  submitFeedbackFailure(error: string): void;
  resetFeedbackForm(): void;

  // User operations
  getUserState(): { user: any; loading: boolean; error: string | null };
  setUser(user: any): void;
  setUserLoading(loading: boolean): void;
  setUserError(error: string): void;
  clearUser(): void;
}

export type StateManagerType = 'redux' | 'zustand';