import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@repo/state";
import {
  submitContactStart,
  submitContactSuccess,
  submitContactFailure,
  resetContactForm,
  selectContactSubmitting,
  selectContactSubmitted,
  selectContactError,
  ContactFormData,
} from "@repo/state";
import { useContactApi } from "../api/useContactApi";

export const useContactForm = () => {
  const dispatch = useAppDispatch();
  const { submitContact: submitContactRequest } = useContactApi();

  const submitting = useAppSelector(selectContactSubmitting);
  const submitted = useAppSelector(selectContactSubmitted);
  const error = useAppSelector(selectContactError);

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const updateField = useCallback((field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const submitForm = useCallback(async () => {
    dispatch(submitContactStart());
    try {
      await submitContactRequest(formData);
      dispatch(submitContactSuccess());
      setFormData({ name: "", email: "", message: "" }); // Reset form
    } catch (error: any) {
      dispatch(submitContactFailure(error?.message ?? "Failed to submit contact form"));
    }
  }, [dispatch, submitContactRequest, formData]);

  const resetForm = useCallback(() => {
    dispatch(resetContactForm());
    setFormData({ name: "", email: "", message: "" });
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