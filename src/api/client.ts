import axios from 'axios';

const baseURL = '/api';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    if (
      config.headers['Content-Type'] === 'undefined' ||
      !config.headers['Content-Type']
    ) {
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      } else {
        config.headers['Content-Type'] = 'application/json';
      }
    }

    const token = localStorage.getItem('access_token');

    if (token) {
      const cleanToken = token
        .replace(/^Bearer\s+/i, '')
        .replace(/^"|"$/g, '')
        .replace(/[\r\n\t]/g, '')
        .trim();

      console.log('🧹 정리된 순수 토큰 문자열:', cleanToken);

      config.headers['Authorization'] = `Bearer ${cleanToken}`;

      console.log(
        '🚀 실제 백엔드로 날아가는 Authorization 헤더:',
        config.headers['Authorization']
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('🚨 401 Unauthorized 발생');
      console.warn('응답 데이터:', error.response?.data);
      console.warn('실제 전송 헤더:', error.config?.headers);
      console.warn(
        '현재 localStorage 토큰:',
        localStorage.getItem('access_token')
      );
    }

    return Promise.reject(error);
  }
);