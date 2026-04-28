import axios from 'axios';

const baseURL = 'https://weepily-tinklier-marguerita.ngrok-free.dev';

export const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: false, 
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 확정된 키 이름 'access_token' 사용
    const token = localStorage.getItem('access_token'); 
    
    if (token) {
      const cleanToken = token.replace(/^(Bearer\s+)+/i, '').replace(/^"|"$/g, '').trim();
      config.headers.set('Authorization', `Bearer ${cleanToken}`);
    }
    
    // ngrok 경고창 스킵 헤더
    config.headers.set('ngrok-skip-browser-warning', '69420');
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("인증 실패: 401 Unauthorized 에러가 발생했습니다.");
      console.warn("백엔드 응답 상세:", error.response?.data);
      console.warn("현재 전송된 헤더:", error.config?.headers);
      
      // 디버깅을 위해 로컬 스토리지 비우기 코드를 잠시 주석 처리합니다.
      // (하나의 API가 401을 반환하면 다른 모든 API를 막아버리는 현상 방지)
      // localStorage.removeItem('access_token');
    }
    return Promise.reject(error);
  }
);