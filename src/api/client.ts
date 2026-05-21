import axios from 'axios';

// ⭕ [핵심 원인 해결] 비어있던 주소창에 진짜 AWS 백엔드 서버 주소를 확실하게 박아 넣습니다!
const baseURL = 'http://3.37.55.120.nip.io:8080';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    // Content-Type 자동 처리
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
      // 토큰 찌꺼기 정리
      const cleanToken = token
        .replace(/^Bearer\s+/i, '')
        .replace(/^"|"$/g, '')
        .replace(/[\r\n\t]/g, '')
        .trim();

      console.log('🧹 정리된 순수 토큰 문자열:', cleanToken);

      // ✅ [스프링 시큐리티 표준 규격] 토큰 앞에 'Bearer '가 없다면 강제로 안전하게 붙여서 쏩니다!
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