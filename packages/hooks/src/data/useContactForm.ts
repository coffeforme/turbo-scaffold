import { useCallback, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useZustandDispatch,
  useZustandSelector,
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

export const useContactForm = (useZustand = false) => {
  const dispatch = useZustand ? useZustandDispatch() : useAppDispatch();
  const { submitContact: submitContactRequest } = useContactApi();

  const submitting = useZustand
    ? useZustandSelector(selectContactSubmitting)
    : useAppSelector(selectContactSubmitting);
  const submitted = useZustand
    ? useZustandSelector(selectContactSubmitted)
    : useAppSelector(selectContactSubmitted);
  const error = useZustand
    ? useZustandSelector(selectContactError)
    : useAppSelector(selectContactError);

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