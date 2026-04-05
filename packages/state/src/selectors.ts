// State selectors
export const selectCounter = (state: any) => state.counter.value;
export const selectUser = (state: any) => state.user.user;
export const selectUserLoading = (state: any) => state.user.loading;
export const selectUserError = (state: any) => state.user.error;
export const selectContactSubmitting = (state: any) => state.contact.submitting;
export const selectContactSubmitted = (state: any) => state.contact.submitted;
export const selectContactError = (state: any) => state.contact.error;
export const selectFeedbackSubmitting = (state: any) => state.feedback.submitting;
export const selectFeedbackSubmitted = (state: any) => state.feedback.submitted;
export const selectFeedbackError = (state: any) => state.feedback.error;