import axios from 'axios';

const baseURL = '';

export const apiClient = axios.create({
  baseURL: baseURL,
  // ⭕ 백엔드 쿠키 및 세션 공유 허용 (로그인 인증 실패 방지 방어코드)
  withCredentials: true, 
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); 
    
    if (token) {
      // 1. 따옴표나 공백 등 지저분한 문자열을 깨끗하게 청소합니다.
      const cleanToken = token.replace(/^"|"$/g, '').trim();
      
      // 2. 만약 이미 토큰 자체에 Bearer가 붙어있다면 중복 부착 방지 처리
      if (cleanToken.toLowerCase().startsWith('bearer ')) {
        config.headers.set('Authorization', cleanToken);
      } else {
        // 3. [기본값] 정석 규격인 'Bearer 토큰내용' 형태로 헤더에 안전하게 장착
        config.headers.set('Authorization', `Bearer ${cleanToken}`);
      }
      
      // 💡 [꿀팁 백엔드 교차 검증용] 만약 백엔드가 Bearer 문구 없는 '순수 토큰' 헤더를 요구할 경우를 대비해, 
      // 아래 주석처리된 변수명(예: access-token 등)을 백엔드 설계에 맞게 커스텀해서 함께 활용할 수도 있습니다.
      // config.headers.set('token', cleanToken); 
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
      
      // 💡 개발 편의를 위해 로컬스토리지에 현재 들어있는 진짜 토큰 날것의 상태를 콘솔에 찍어봅니다.
      console.warn("현재 로컬스토리지 토큰 상태:", localStorage.getItem('access_token'));
    }
    return Promise.reject(error);
  }
);