import { apiClient } from "./client";

export const authApi = {
  logout: async () => {
    const { data } = await apiClient.post("/api/auth/logout");
    return data;
  },
};