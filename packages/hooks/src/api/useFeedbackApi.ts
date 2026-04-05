import { apiClient } from "@repo/api";
import { FeedbackFormData } from "@repo/state";

export const useFeedbackApi = () => {
  const submitFeedback = async (data: FeedbackFormData) => {
    return apiClient.post("/feedback", data);
  };

  return { submitFeedback };
};