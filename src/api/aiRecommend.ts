import { apiClient } from "./client";

// ✅ 백엔드 AI 추천 API 응답 데이터 타입 정의 (title 스펙 명시)
export interface AIRecommendation {
  recruitPostId: number;
  title: string; // ✨ 타입 추론 에러 방지를 위해 명시적으로 추가
  memberId: number;
  memberRole: string;
  recruitCategory: string;
  roleMatched: boolean;
  roleScore: number;
  memberActivityCategories: string[];
  recruitActivityCategory: string;
  activityCategoryMatched: boolean;
  activityCategoryScore: number;
  requiredSkills: string[];
  memberSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  skillScore: number;
  matchingScore: number;
  aiComment: string; // 백엔드가 넘겨주는 AI 분석 코멘트 문장
}

export const aiRecommendApi = {
  // 로그인한 유저를 위한 AI 맞춤 프로젝트 목록 조회
  getAiRecommendations: async (): Promise<AIRecommendation[]> => {
    const response = await apiClient.get('/api/recruits/recommendations/me');
    return response.data; // 백엔드가 주는 배열 데이터 반환
  }
};

