import { useCounter } from "../data/userCounter";
import { useContactForm } from "../data/useContactForm";
import { useFeedbackForm } from "../data/useFeedbackForm";

export const useHome = (useZustand = false) => {
  const { value, increase } = useCounter(useZustand);
  const {
    formData: contactFormData,
    updateField: updateContactField,
    submitForm: submitContactForm,
    resetForm: resetContactForm,
    submitting: contactSubmitting,
    submitted: contactSubmitted,
    error: contactError,
  } = useContactForm(useZustand);

  const {
    formData: feedbackFormData,
    updateField: updateFeedbackField,
    submitForm: submitFeedbackForm,
    resetForm: resetFeedbackForm,
    submitting: feedbackSubmitting,
    submitted: feedbackSubmitted,
    error: feedbackError,
  } = useFeedbackForm(useZustand);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactForm();
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedbackForm();
  };

  return {
    counter: { value, increase },
    contactForm: {
      formData: contactFormData,
      updateField: updateContactField,
      submitForm: submitContactForm,
      resetForm: resetContactForm,
      submitting: contactSubmitting,
      submitted: contactSubmitted,
      error: contactError,
      handleSubmit: handleContactSubmit,
    },
    feedbackForm: {
      formData: feedbackFormData,
      updateField: updateFeedbackField,
      submitForm: submitFeedbackForm,
      resetForm: resetFeedbackForm,
      submitting: feedbackSubmitting,
      submitted: feedbackSubmitted,
      error: feedbackError,
      handleSubmit: handleFeedbackSubmit,
    },
  };
};