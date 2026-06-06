import { apiClient } from "./client";

export interface AIRecommendation {
  recruitPostId: number;
  title: string; 
  activityCategory: string;     
  recruitCategory: string;        
  requiredSkills: string[];
  memberSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  roleScore: number;
  activityCategoryScore: number; 
  skillScore: number;
  matchingScore: number;         
  totalHeadcount: number;
  applicantCount: number;
  deadline: string;
  aiComment: string;              
}

export const aiRecommendApi = {
  getAiRecommendations: async (): Promise<AIRecommendation[]> => {
    const response = await apiClient.get('/recruits/recommendations/me');
    return response.data; 
  }
};