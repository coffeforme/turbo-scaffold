import type { RootState } from "./types";

export const selectCounter = (state: RootState) => state.counter.value;
export const selectUser = (state: RootState) => state.user.user;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectContactSubmitting = (state: RootState) => state.contact.submitting;
export const selectContactSubmitted = (state: RootState) => state.contact.submitted;
export const selectContactError = (state: RootState) => state.contact.error;
export const selectContactFormData = (state: RootState) => state.contact.formData;
export const selectFeedbackSubmitting = (state: RootState) => state.feedback.submitting;
export const selectFeedbackSubmitted = (state: RootState) => state.feedback.submitted;
export const selectFeedbackError = (state: RootState) => state.feedback.error;
export const selectFeedbackFormData = (state: RootState) => state.feedback.formData;
