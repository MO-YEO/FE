import axios from 'axios';

const baseURL = '';

export const apiClient = axios.create({
  baseURL: baseURL,
  // 백엔드 쿠키 및 세션 공유 허용 (로그인 인증 실패 방지 방어코드)
  withCredentials: true, 
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); 
    
    if (token) {
      // ⭕ 혹시 모를 찌꺼기 문자열을 날리고 순수 텍스트만 추출합니다.
      const cleanToken = token.replace(/^"|"$/g, '').trim();
      
      // 만약 이미 토큰 자체에 Bearer가 붙어있다면 중복 부착 방지 처리
      if (cleanToken.toLowerCase().startsWith('bearer ')) {
        config.headers.set('Authorization', cleanToken);
      } else {
        // [정석 규격] 앞머리에 한 칸 공백을 두고 'Bearer [토큰값]' 형태로 안전하게 장착
        config.headers.set('Authorization', `Bearer ${cleanToken}`);
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