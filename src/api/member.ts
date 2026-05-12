import { apiClient } from './client';
import type { MemberListResponse, MyProfileResponse, MemberDetail } from '../types';

export const membersApi = {
  // ✅ 신규 계정 생성 (최초 프로필 등록)
  signUp: async (data: any) => {
    const response = await apiClient.post<MyProfileResponse>('/api/members/signup', data);
    return response.data;
  },

  getMyProfile: async () => {
    const { data } = await apiClient.get<MyProfileResponse>('/api/members/me');
    return data;
  },

  updateMyProfile: async (data: any) => {
    const response = await apiClient.patch<MyProfileResponse>('/api/members/me', data);
    return response.data;
  },

  getMembers: async (params?: { techStack?: string; activityCategory?: string; page?: number; size?: number }) => {
    const { data } = await apiClient.get<MemberListResponse>('/api/members', { params });
    return data;
  },

  getMemberDetail: async (memberId: number) => {
    const { data } = await apiClient.get<MemberDetail>(`/api/members/${memberId}`);
    return data;
  },
};