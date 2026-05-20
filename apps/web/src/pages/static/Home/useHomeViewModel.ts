import { useHomeViewModel as usePackageHomeViewModel } from "@repo/hooks";
import {
  getCurrentManagerType,
  setStateManagerType,
  useAgnosticContactForm,
  useAgnosticCounter,
  useAgnosticFeedbackForm,
} from "@repo/state";
import { useStateProvider } from "../../../components/StateProvider";

export function useHomeViewModel() {
  const { providerType, setProviderType } = useStateProvider();
  const home = usePackageHomeViewModel(providerType === "zustand");
  const agnosticCounter = useAgnosticCounter();
  const agnosticContact = useAgnosticContactForm();
  const agnosticFeedback = useAgnosticFeedbackForm();

  const handleProviderChange = (type: "redux" | "zustand") => {
    setProviderType(type);
    setStateManagerType(type);
  };

  const handleAgnosticContactSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    agnosticContact.submitForm();
  };

  const handleAgnosticFeedbackSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    agnosticFeedback.submitForm();
  };

  return {
    providerType,
    handleProviderChange,
    currentManagerType: getCurrentManagerType(),
    counter: home.counter,
    contactForm: home.contactForm,
    feedbackForm: home.feedbackForm,
    agnosticCounter,
    agnosticContact,
    agnosticFeedback,
    handleAgnosticContactSubmit,
    handleAgnosticFeedbackSubmit,
  };
}
