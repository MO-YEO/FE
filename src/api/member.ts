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
    // ⭕ /api 제거 -> 최종 주소: /api/members/me
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
    // ⭕ /api 제거 및 백엔드 스펙에 맞게 patch 유지
    const response = await apiClient.patch<MyProfileResponse>('/members/me', payload);
    return response.data;
  },

  /** 3. 팀원 목록 조회 */
  getMembers: async (params?: { techStack?: string; activityCategory?: string; page?: number; size?: number }) => {
    // ⭕ /api 제거 -> 최종 주소: /api/members
    const { data } = await apiClient.get<MemberListResponse>('/members', { params });
    return data;
  },

  /** 4. 타 사용자 상세 프로필 조회 */
  getMemberDetail: async (memberId: number) => {
    // ⭕ /api 제거 -> 최종 주소: /api/members/${memberId}
    const { data } = await apiClient.get<MemberDetail>(
      `/members/${memberId}`,
    );
    return data;
  },

  bookmarkMember: async (memberId: number) => {
    // ⭕ /api 제거 -> 최종 주소: /api/members/${memberId}/bookmark
    const { data } = await apiClient.post(
      `/members/${memberId}/bookmark`,
      {},
    );
    return data;
  },

  registerTeamProfile: async (payload: TeamProfileRegisterRequest) => {
    // ⭕ /api 제거 -> 최종 주소: /api/members/me/team-profile
    const { data } = await apiClient.post(
      "/members/me/team-profile",
      payload,
    );
    return data;
  },
};