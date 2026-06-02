import { apiClient } from "./client";

export const authApi = {
  logout: async () => {
    const { data } = await apiClient.post("/api/auth/logout");
    return data;
  },

  withdrawAccount: async () => {
    const { data } = await apiClient.delete("/api/members/me");
    return data;
  },
};