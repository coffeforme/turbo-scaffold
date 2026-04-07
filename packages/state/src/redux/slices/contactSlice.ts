import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createInitialContactFormData,
  type ContactFormData,
  type ContactState,
} from "../../shared/types";

const initialState: ContactState = {
  formData: createInitialContactFormData(),
  submitting: false,
  submitted: false,
  error: null,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    updateContactField: (
      state,
      action: PayloadAction<{ field: keyof ContactFormData; value: string }>,
    ) => {
      state.formData[action.payload.field] = action.payload.value;
      state.submitted = false;
      state.error = null;
    },
    submitContactStart: (state) => {
      state.submitting = true;
      state.error = null;
    },
    submitContactSuccess: (state) => {
      state.formData = createInitialContactFormData();
      state.submitting = false;
      state.submitted = true;
    },
    submitContactFailure: (state, action: PayloadAction<string>) => {
      state.submitting = false;
      state.error = action.payload;
    },
    resetContactForm: (state) => {
      state.formData = createInitialContactFormData();
      state.submitting = false;
      state.submitted = false;
      state.error = null;
    },
  },
});

export const {
  updateContactField,
  submitContactStart,
  submitContactSuccess,
  submitContactFailure,
  resetContactForm,
} = contactSlice.actions;
export default contactSlice.reducer;
