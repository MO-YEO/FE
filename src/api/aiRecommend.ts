import { apiClient } from "./client";

export interface AIRecommendation {
  recruitPostId: number;
  title: string; 
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
  getAiRecommendations: async (): Promise<any> => {
    const response = await apiClient.get('/recruits/recommendations/me');
    return response.data; 
  }
};