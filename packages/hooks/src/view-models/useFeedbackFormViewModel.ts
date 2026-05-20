import { useCallback, type FormEvent } from "react";
import { useFeedbackForm } from "../data/useFeedbackForm";

export const useFeedbackFormViewModel = (useZustand = false) => {
  const model = useFeedbackForm(useZustand);

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
