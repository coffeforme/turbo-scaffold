import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@repo/state";
import {
  submitFeedbackStart,
  submitFeedbackSuccess,
  submitFeedbackFailure,
  resetFeedbackForm,
  selectFeedbackSubmitting,
  selectFeedbackSubmitted,
  selectFeedbackError,
  FeedbackFormData,
} from "@repo/state";
import { useFeedbackApi } from "../api/useFeedbackApi";

export const useFeedbackForm = () => {
  const dispatch = useAppDispatch();
  const { submitFeedback: submitFeedbackRequest } = useFeedbackApi();

  const submitting = useAppSelector(selectFeedbackSubmitting);
  const submitted = useAppSelector(selectFeedbackSubmitted);
  const error = useAppSelector(selectFeedbackError);

  const [formData, setFormData] = useState<FeedbackFormData>({
    rating: 0,
    comment: "",
    category: "general",
  });

  const updateField = useCallback((field: keyof FeedbackFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const submitForm = useCallback(async () => {
    dispatch(submitFeedbackStart());
    try {
      await submitFeedbackRequest(formData);
      dispatch(submitFeedbackSuccess());
      setFormData({ rating: 0, comment: "", category: "general" }); // Reset form
    } catch (error: any) {
      dispatch(submitFeedbackFailure(error?.message ?? "Failed to submit feedback"));
    }
  }, [dispatch, submitFeedbackRequest, formData]);

  const resetForm = useCallback(() => {
    dispatch(resetFeedbackForm());
    setFormData({ rating: 0, comment: "", category: "general" });
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