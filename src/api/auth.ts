import { apiClient } from "./client";

export const authApi = {
  logout: async () => {
    const { data } = await apiClient.post("/api/auth/logout");
    return data;
  },

  withdrawAccount: async () => {
    const token = localStorage.getItem("access_token");
    const cleanToken = token
      ? token
          .replace(/^Bearer\s+/i, "")
          .replace(/^"|"$/g, "")
          .replace(/[\r\n\t]/g, "")
          .trim()
      : "";

    const { data } = await apiClient.delete("/api/members/me", {
      withCredentials: true, 
      headers: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });
    
    return data;
  },
};