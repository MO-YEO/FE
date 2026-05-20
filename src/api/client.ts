import axios from 'axios';

const baseURL = '';

export const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true, // 백엔드 쿠키 및 세션 공유 허용
});

apiClient.interceptors.request.use(
  (config) => {
    // 1. 혹시라도 Content-Type이 문자열 "undefined"로 꼬여있다면 정석대로 복구하거나 제거
    if (config.headers['Content-Type'] === 'undefined' || !config.headers['Content-Type']) {
      if (config.data instanceof FormData) {
        // FormData 형식일 때는 브라우저가 알아서 바운더리를 지정하도록 헤더에서 삭제
        delete config.headers['Content-Type'];
      } else {
        // 일반적인 GET/POST 요청은 application/json으로 고정
        config.headers['Content-Type'] = 'application/json';
      }
    }

    const token = localStorage.getItem('access_token'); 
    
    if (token) {
      // 따옴표나 양끝 공백을 깔끔하게 청소
      const cleanToken = token.replace(/^"|"$/g, '').trim();
      
      // 2. 안전하게 Authorization 헤더 세팅
      if (cleanToken.toLowerCase().startsWith('bearer ')) {
        config.headers['Authorization'] = cleanToken;
      } else {
        config.headers['Authorization'] = `Bearer ${cleanToken}`;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("🚨 인증 실패: 401 Unauthorized 에러가 발생했습니다.");
      console.warn("백엔드 응답 상세 데이터:", error.response?.data);
      console.warn("실제 전송 시도했던 헤더 목록:", error.config?.headers);
      console.warn("현재 로컬스토리지 토큰 상태:", localStorage.getItem('access_token'));
    }
    return Promise.reject(error);
  }
);