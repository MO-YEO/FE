import { apiClient } from "./client";
import type {
  RecruitListResponse,
  RecruitDetail,
  MyRecruitListResponse,
  AppliedRecruitListResponse,
  GetRecruits,
  ApplyRequest,
  PatchRecruitParams,
} from "../types";

export const recruitsApi = {
  // 프로젝트 목록 필터링 조회
  getRecruits: async (params?: GetRecruits) => {
    const { data } = await apiClient.get<RecruitListResponse>("/api/recruits", {
      params,
    });
    return data;
  },

  // 신규 프로젝트 등록
  createRecruit: async (payload: any) => {
    const { data } = await apiClient.post<RecruitDetail>(
      "/api/recruits",
      payload,
    );
    return data;
  },

  //프로젝트 삭제
  deleteRecruit: async (recruitId: number) => {
    await apiClient.delete(`api/recruits/${recruitId}`);
  },

  //프로젝트 수정
  patchRecruit: async (recruitId: number, payload: PatchRecruitParams) => {
    await apiClient.patch(`api/recruits/${recruitId}`, payload);
  },

  // 프로젝트 상세 조회
  getRecruitDetail: async (recruitId: number) => {
    const { data } = await apiClient.get<RecruitDetail>(
      `/api/recruits/${recruitId}`,
    );
    return data;
  },

  // 내가 모집 중인 글 조회
  getMyRecruits: async (params?: { page?: number; size?: number }) => {
    const { data } = await apiClient.get<MyRecruitListResponse>(
      "/api/recruits/me",
      { params },
    );
    return data;
  },

  // 내가 지원 완료한 프로젝트 조회 (통계용)
  getAppliedRecruits: async (params?: { page?: number; size?: number }) => {
    const { data } = await apiClient.get<AppliedRecruitListResponse>(
      "/api/recruits/applied",
      { params },
    );
    return data;
  },

  getRecruitApplications: async (
    recruitId: number,
    params?: { page?: number; size?: number },
  ) => {
    const { data } = await apiClient.get(
      `/api/recruits/${recruitId}/applications`,
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
      `/api/recruits/${recruitId}/applications/${applicationId}`,
      payload,
    );
    return data;
  },

  getParticipatingRecruits: async (params?: {
    page?: number;
    size?: number;
  }) => {
    const { data } = await apiClient.get("/api/recruits/participating", {
      params,
    });
    return data;
  },

  // 프로젝트 지원하기 (ApplySheet 연동)
  apply: async (recruitId: number, payload?: ApplyRequest) => {
    const { data } = await apiClient.post(
      `/api/recruits/${recruitId}/apply`,
      payload,
    );
    return data;
  },

  // 지원 취소하기
  cancelRecruitApplication: async (recruitId: number) => {
    const { data } = await apiClient.delete(`/api/recruits/${recruitId}/apply`);
    return data;
  },

  //프로젝트 북마크
  bookmark: async (recruitId: number) => {
    const { data } = await apiClient.post(
      `/api/recruits/${recruitId}/bookmark`,
    );
    return data;
  },
  cancelBookmark: async (recruitId: number) => {
    const { data } = await apiClient.delete(
      `/api/recruits/${recruitId}/bookmark`,
    );
    return data;
  },
};
