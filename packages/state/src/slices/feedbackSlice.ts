import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FeedbackFormData {
  rating: number;
  comment: string;
  category: string;
}

export interface FeedbackState {
  submitting: boolean;
  submitted: boolean;
  error: string | null;
}

const initialState: FeedbackState = {
  submitting: false,
  submitted: false,
  error: null,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    submitFeedbackStart: (state) => {
      state.submitting = true;
      state.error = null;
    },
    submitFeedbackSuccess: (state) => {
      state.submitting = false;
      state.submitted = true;
    },
    submitFeedbackFailure: (state, action: PayloadAction<string>) => {
      state.submitting = false;
      state.error = action.payload;
    },
    resetFeedbackForm: (state) => {
      state.submitting = false;
      state.submitted = false;
      state.error = null;
    },
  },
});

export const {
  submitFeedbackStart,
  submitFeedbackSuccess,
  submitFeedbackFailure,
  resetFeedbackForm,
} = feedbackSlice.actions;
export default feedbackSlice.reducer;