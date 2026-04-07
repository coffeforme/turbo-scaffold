import { apiClient } from "@repo/api";

export const useUserApi = () => {
  const fetchUser = async (userId: number) => {
    return apiClient.get(`/users/${userId}`);
  };

  return { fetchUser };
};