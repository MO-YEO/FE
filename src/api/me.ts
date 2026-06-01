import { apiClient } from "./client";

export const meApi = {
  getMe: async () => {
    const { data } = await apiClient.get<number>("/me");
    return data;
  },
};
