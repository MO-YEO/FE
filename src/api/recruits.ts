import { apiClient } from "./client";
import type {
  RecruitListResponse,
  RecruitDetail,
  MyRecruitListResponse,
  AppliedRecruitListResponse,
  GetRecruits,
  ApplyRequest,
} from "../types";

export const recruitsApi = {
  // 프로젝트 목록 필터링 조회
  getRecruits: async (params?: GetRecruits) => {
    const { data } = await apiClient.get<RecruitListResponse>("/recruits", {
      params,
    });
    return data;
  },

  // 신규 프로젝트 등록
  createRecruit: async (payload: any) => {
    const { data } = await apiClient.post<RecruitDetail>("/recruits", payload);
    return data;
  },

  //프로젝트 삭제
  deleteRecruit: async (recruitId: number) => {
    await apiClient.delete(`/recruits/${recruitId}`);
  },

  //프로젝트 수정
  patchRecruit: async (recruitId: number, payload: any) => {
    await apiClient.patch(`/recruits/${recruitId}`, payload);
  },

  // 프로젝트 상세 조회
  getRecruitDetail: async (recruitId: number) => {
    const { data } = await apiClient.get<RecruitDetail>(
      `/recruits/${recruitId}`,
    );
    return data;
  },

  // 내가 모집 중인 글 조회
  getMyRecruits: async (params?: { page?: number; size?: number }) => {
    const { data } = await apiClient.get<MyRecruitListResponse>(
      "/recruits/me",
      { params },
    );
    return data;
  },

  // 내가 지원 완료한 프로젝트 조회 (통계용)
  getAppliedRecruits: async (params?: { page?: number; size?: number }) => {
    const { data } = await apiClient.get<AppliedRecruitListResponse>(
      "/recruits/applied",
      { params },
    );
    return data;
  },

  getRecruitApplications: async (
    recruitId: number,
    params?: { page?: number; size?: number },
  ) => {
    const { data } = await apiClient.get(
      `/recruits/${recruitId}/applications`,
      { params },
    );
    return data;
  },

  updateApplicationStatus: async (
    recruitId: number,
    applicationId: number,
    payload: { status: "ACCEPTED" | "REJECTED" },
  ) => {
    const { data } = await apiClient.patch(
      `/recruits/${recruitId}/applications/${applicationId}`,
      payload,
    );
    return data;
  },

  getParticipatingRecruits: async (params?: {
    page?: number;
    size?: number;
  }) => {
    const { data } = await apiClient.get("/recruits/participating", {
      params,
    });
    return data;
  },

  // 프로젝트 지원하기 (ApplySheet 연동)
  apply: async (recruitId: number, payload?: ApplyRequest) => {
    const { data } = await apiClient.post(
      `/recruits/${recruitId}/apply`,
      payload,
    );
    return data;
  },

  // 지원 취소하기
  cancelRecruitApplication: async (recruitId: number) => {
    const { data } = await apiClient.delete(`/recruits/${recruitId}/apply`);
    return data;
  },

  //프로젝트 북마크
  bookmark: async (recruitId: number) => {
    const { data } = await apiClient.post(`/recruits/${recruitId}/bookmark`);
    return data;
  },
  cancelBookmark: async (recruitId: number) => {
    const { data } = await apiClient.delete(`/recruits/${recruitId}/bookmark`);
    return data;
  },
};
