import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ContactState } from "../../shared/types";

const initialState: ContactState = {
  submitting: false,
  submitted: false,
  error: null,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    submitContactStart: (state) => {
      state.submitting = true;
      state.error = null;
    },
    submitContactSuccess: (state) => {
      state.submitting = false;
      state.submitted = true;
    },
    submitContactFailure: (state, action: PayloadAction<string>) => {
      state.submitting = false;
      state.error = action.payload;
    },
    resetContactForm: (state) => {
      state.submitting = false;
      state.submitted = false;
      state.error = null;
    },
  },
});

export const {
  submitContactStart,
  submitContactSuccess,
  submitContactFailure,
  resetContactForm,
} = contactSlice.actions;
export default contactSlice.reducer;
