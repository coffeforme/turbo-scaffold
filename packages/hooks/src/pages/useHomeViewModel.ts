import { useCounter } from "../data/userCounter";
import { useContactFormViewModel } from "../view-models/useContactFormViewModel";
import { useFeedbackFormViewModel } from "../view-models/useFeedbackFormViewModel";

export const useHomeViewModel = (useZustand = false) => {
  const { value, increase } = useCounter(useZustand);
  const contactForm = useContactFormViewModel(useZustand);
  const feedbackForm = useFeedbackFormViewModel(useZustand);

  return {
    counter: { value, increase },
    contactForm,
    feedbackForm,
  };
};
