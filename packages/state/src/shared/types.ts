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

export interface RootState {
  counter: CounterState;
  user: UserState;
  contact: ContactState;
  feedback: FeedbackState;
}

export const createInitialRootState = (): RootState => ({
  counter: { value: 0 },
  user: { user: null, loading: false, error: null },
  contact: { submitting: false, submitted: false, error: null },
  feedback: { submitting: false, submitted: false, error: null },
});
