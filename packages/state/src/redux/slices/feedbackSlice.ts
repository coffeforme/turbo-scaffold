import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createInitialFeedbackFormData,
  type FeedbackFormData,
  type FeedbackState,
} from "../../shared/types";

const initialState: FeedbackState = {
  formData: createInitialFeedbackFormData(),
  submitting: false,
  submitted: false,
  error: null,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    updateFeedbackField: (
      state,
      action: PayloadAction<{ field: keyof FeedbackFormData; value: string | number }>,
    ) => {
      state.formData[action.payload.field] = action.payload.value as never;
      state.submitted = false;
      state.error = null;
    },
    submitFeedbackStart: (state) => {
      state.submitting = true;
      state.error = null;
    },
    submitFeedbackSuccess: (state) => {
      state.formData = createInitialFeedbackFormData();
      state.submitting = false;
      state.submitted = true;
    },
    submitFeedbackFailure: (state, action: PayloadAction<string>) => {
      state.submitting = false;
      state.error = action.payload;
    },
    resetFeedbackForm: (state) => {
      state.formData = createInitialFeedbackFormData();
      state.submitting = false;
      state.submitted = false;
      state.error = null;
    },
  },
});

export const {
  updateFeedbackField,
  submitFeedbackStart,
  submitFeedbackSuccess,
  submitFeedbackFailure,
  resetFeedbackForm,
} = feedbackSlice.actions;
export default feedbackSlice.reducer;
