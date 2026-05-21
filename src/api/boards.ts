import { apiClient } from './client';
import type { BoardListResponse } from '../types';

export const boardsApi = {
  // 게시글 전체 목록 조회
  getPosts: async (params?: { keyword?: string; page?: number; size?: number }) => {
    const { data } = await apiClient.get<BoardListResponse>('/boards/posts', { params });
    return data;
  },

  // 내가 쓴 게시판 글 조회
  getMyPosts: async (params?: { page?: number; size?: number }) => {
    const { data } = await apiClient.get<BoardListResponse>('/boards/posts/me', { params });
    return data;
  },

  // 스크랩한 게시물 조회
  getScrappedPosts: async (params?: { page?: number; size?: number }) => {
    const { data } = await apiClient.get<BoardListResponse>("/boards/posts/bookmarks", { params });
    return data;
  },

  // 좋아요한 게시물 조회
  getLikedPosts: async (params?: { page?: number; size?: number }) => {
    const { data } = await apiClient.get<BoardListResponse>('/boards/posts/likes', { params });
    return data;
  },

  // 상세 조회
  getPostDetail: async (postId: number) => {
    const { data } = await apiClient.get<any>(`/boards/posts/${postId}`);
    return data;
  },

  // 수정 (PUT 규격에 맞춰 매핑 가능하도록 설정)
  updatePost: async (postId: number, payload: { title: string; content: string; images?: any[] }) => {
    const { data } = await apiClient.put(`/boards/posts/${postId}`, payload);
    return data;
  },

  // 삭제
  deletePost: async (postId: number) => {
    const { data } = await apiClient.delete(`/boards/posts/${postId}`);
    return data;
  },

  // 💬 댓글 목록 조회
  getComments: async (postId: number) => {
    const { data } = await apiClient.get<any>(`/boards/posts/${postId}/comments`);
    return data;
  },

  // 💬 댓글 작성
  createComment: async (postId: number, payload: { content: string }) => {
    const { data } = await apiClient.post(`/boards/posts/${postId}/comments`, payload);
    return data;
  },

  // 💬 댓글 수정
  updateComment: async (commentId: number, payload: { content: string }) => {
    const { data } = await apiClient.put(`/boards/comments/${commentId}`, payload);
    return data;
  },

  // 💬 댓글 삭제
  deleteComment: async (commentId: number) => {
    const { data } = await apiClient.delete(`/boards/comments/${commentId}`);
    return data;
  },

  likePost: async (postId: number) => {
    const { data } = await apiClient.post(`/boards/posts/${postId}/like`);
    return data;
  },
  unlikePost: async (postId: number) => {
    const { data } = await apiClient.delete(`/boards/posts/${postId}/like`);
    return data;
  }
};