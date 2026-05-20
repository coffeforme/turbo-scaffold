import { useCallback, type FormEvent } from "react";
import { useContactForm } from "../data/useContactForm";

export const useContactFormViewModel = (useZustand = false) => {
  const model = useContactForm(useZustand);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      void model.submitForm();
    },
    [model],
  );

  return {
    ...model,
    handleSubmit,
  };
};
