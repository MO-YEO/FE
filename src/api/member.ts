import { apiClient } from "./client";
import type {
  MemberListResponse,
  MyProfileResponse,
  MemberDetail,
  TeamProfileRegisterRequest,
} from "../types";

export const membersApi = {
  /** 1. 내 프로필 정보 조회 */
  getMyProfile: async () => {
    const { data } = await apiClient.get<MyProfileResponse>("/members/me");
    return data;
  },

  /** 2. 내 프로필 수정 및 최초 등록 
   * PATCH /members/me
   */
  updateMyProfile: async (payload: {
    nickname: string;
    profileImageUrl?: string;
    role: string;
    contactEmail: string;
    phoneNumber?: string;
    githubUrl?: string;
    intro: string;
    techStacks: string[];
    activityCategories?: string[];
  }) => {
    const response = await apiClient.patch<MyProfileResponse>('/members/me', payload);
    return response.data;
  },

  /** 3. 팀원 목록 조회 */
  getMembers: async (params?: { techStack?: string; activityCategory?: string; page?: number; size?: number }) => {
    const { data } = await apiClient.get<MemberListResponse>('/members', { params });
    return data;
  },

  getMemberDetail: async (memberId: number) => {
    const { data } = await apiClient.get<MemberDetail>(
      `/members/${memberId}`,
    );
    return data;
  },

  bookmarkMember: async (memberId: number) => {
    const { data } = await apiClient.post(
      `/members/${memberId}/bookmark`,
      {},
    );
    return data;
  },

  registerTeamProfile: async (payload: TeamProfileRegisterRequest) => {
    const { data } = await apiClient.post(
      "/members/me/team-profile",
      payload,
    );
    return data;
  },
};