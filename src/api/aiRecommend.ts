import { apiClient } from "./client";

export interface AIRecommendation {
  recruitPostId: number;
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
  aiComment: string;             
}

export const aiRecommendApi = {
  getAiRecommendations: async (recruitPostId: number): Promise<AIRecommendation> => {
    const response = await apiClient.get(`/recruit-posts/${recruitPostId}/matching/ai/me`);
    return response.data; 
  }
};