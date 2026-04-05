import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FeedbackState } from "../../shared/types";

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
