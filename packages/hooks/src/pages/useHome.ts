import { useCounter } from "../data/userCounter";
import { useContactForm } from "../data/useContactForm";

export const useHome = () => {
  const { value, increase } = useCounter();
  const {
    formData,
    updateField,
    submitForm,
    resetForm,
    submitting,
    submitted,
    error,
  } = useContactForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return {
    counter: { value, increase },
    contactForm: {
      formData,
      updateField,
      submitForm,
      resetForm,
      submitting,
      submitted,
      error,
      handleSubmit,
    },
  };
};