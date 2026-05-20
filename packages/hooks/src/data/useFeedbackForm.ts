import { useCallback } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useZustandDispatch,
  useZustandSelector,
  updateFeedbackField,
  submitFeedbackStart,
  submitFeedbackSuccess,
  submitFeedbackFailure,
  resetFeedbackForm,
  selectFeedbackFormData,
  selectFeedbackSubmitting,
  selectFeedbackSubmitted,
  selectFeedbackError,
} from "@repo/state";
import { useFeedbackApi } from "../api/useFeedbackApi";

export const useFeedbackForm = (useZustand = false) => {
  const dispatch = useZustand ? useZustandDispatch() : useAppDispatch();
  const { submitFeedback: submitFeedbackRequest } = useFeedbackApi();
  const formData = useZustand
    ? useZustandSelector(selectFeedbackFormData)
    : useAppSelector(selectFeedbackFormData);

  const submitting = useZustand
    ? useZustandSelector(selectFeedbackSubmitting)
    : useAppSelector(selectFeedbackSubmitting);
  const submitted = useZustand
    ? useZustandSelector(selectFeedbackSubmitted)
    : useAppSelector(selectFeedbackSubmitted);
  const error = useZustand
    ? useZustandSelector(selectFeedbackError)
    : useAppSelector(selectFeedbackError);

  const updateField = useCallback((field: "rating" | "comment" | "category", value: string | number) => {
    dispatch(updateFeedbackField({ field, value }));
  }, [dispatch]);

  const submitForm = useCallback(async () => {
    dispatch(submitFeedbackStart());
    try {
      await submitFeedbackRequest(formData);
      dispatch(submitFeedbackSuccess());
    } catch (error: any) {
      dispatch(submitFeedbackFailure(error?.message ?? "Failed to submit feedback"));
    }
  }, [dispatch, submitFeedbackRequest, formData]);

  const resetForm = useCallback(() => {
    dispatch(resetFeedbackForm());
  }, [dispatch]);

  return {
    formData,
    updateField,
    submitForm,
    resetForm,
    submitting,
    submitted,
    error,
  };
};

export type FeedbackFormModel = ReturnType<typeof useFeedbackForm>;
