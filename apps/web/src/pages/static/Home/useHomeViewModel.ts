import {
  getCurrentManagerType,
  useAgnosticContactForm,
  useAgnosticCounter,
  useAgnosticFeedbackForm,
} from "@repo/state";
import { useStateProvider } from "../../../components/StateProvider";

export function useHomeViewModel() {
  const { providerType, setProviderType } = useStateProvider();
  const agnosticCounter = useAgnosticCounter();
  const agnosticContact = useAgnosticContactForm();
  const agnosticFeedback = useAgnosticFeedbackForm();

  const handleProviderChange = (type: "redux" | "zustand") => {
    setProviderType(type);
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
    agnosticCounter,
    agnosticContact,
    agnosticFeedback,
    handleAgnosticContactSubmit,
    handleAgnosticFeedbackSubmit,
  };
}
