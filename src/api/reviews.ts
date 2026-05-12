import { apiClient } from "./client";

export type CreateReviewRequest = {
  targetUserId: number;
  recruitPostId: number;
  rating: number;
  content: string;
};

export type ReviewResponse = {
  reviewId: number;
};

export type ApplicantReview = {
  reviewId: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export const reviewsApi = {
  createReview: async (payload: CreateReviewRequest) => {
    const { data } = await apiClient.post<ReviewResponse>(
      "/api/reviews",
      payload,
    );
    return data;
  },

  getApplicantReviews: async (recruitId: number, applicantUserId: number) => {
    const { data } = await apiClient.get<ApplicantReview[]>(
      `/api/reviews/recruits/${recruitId}/applicants/${applicantUserId}`,
    );
    return data;
  },
};