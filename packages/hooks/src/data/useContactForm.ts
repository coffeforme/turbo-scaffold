import { useCallback } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useZustandDispatch,
  useZustandSelector,
  updateContactField,
  submitContactStart,
  submitContactSuccess,
  submitContactFailure,
  resetContactForm,
  selectContactFormData,
  selectContactSubmitting,
  selectContactSubmitted,
  selectContactError,
} from "@repo/state";
import { useContactApi } from "../api/useContactApi";

export const useContactForm = (useZustand = false) => {
  const dispatch = useZustand ? useZustandDispatch() : useAppDispatch();
  const { submitContact: submitContactRequest } = useContactApi();
  const formData = useZustand
    ? useZustandSelector(selectContactFormData)
    : useAppSelector(selectContactFormData);

  const submitting = useZustand
    ? useZustandSelector(selectContactSubmitting)
    : useAppSelector(selectContactSubmitting);
  const submitted = useZustand
    ? useZustandSelector(selectContactSubmitted)
    : useAppSelector(selectContactSubmitted);
  const error = useZustand
    ? useZustandSelector(selectContactError)
    : useAppSelector(selectContactError);

  const updateField = useCallback((field: "name" | "email" | "message", value: string) => {
    dispatch(updateContactField({ field, value }));
  }, [dispatch]);

  const submitForm = useCallback(async () => {
    dispatch(submitContactStart());
    try {
      await submitContactRequest(formData);
      dispatch(submitContactSuccess());
    } catch (error: any) {
      dispatch(submitContactFailure(error?.message ?? "Failed to submit contact form"));
    }
  }, [dispatch, submitContactRequest, formData]);

  const resetForm = useCallback(() => {
    dispatch(resetContactForm());
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

export type ContactFormModel = ReturnType<typeof useContactForm>;
