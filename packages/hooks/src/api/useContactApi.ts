import { apiClient } from "@repo/api";
import { ContactFormData } from "@repo/state";

export const useContactApi = () => {
  const submitContact = async (data: ContactFormData) => {
    return apiClient.post("/contact", data);
  };

  return { submitContact };
};