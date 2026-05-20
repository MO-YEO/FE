import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import { PATH } from "../components/path";

const OAuthCallback: React.FC = () => {
  const isProcessed = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. [초특급 중요] 백엔드가 outh(a 없음)로 주소를 쐈다면, 강제로 oauth(a 있음)로 주소를 교정해서 리다이렉트합니다.
    const currentPath = window.location.pathname; // 예: /outh/callback
    if (currentPath.includes("/outh/")) {
      console.log("⚠️ 백엔드 오타 주소(/outh/) 감지! 정석 주소(/oauth/)로 자동 교정합니다.");
      const correctedUrl = window.location.href.replace("/outh/", "/oauth/");
      window.location.replace(correctedUrl); // 브라우저 주소창 자체를 바꾼 후 새로고침하여 재진입
      return;
    }

    if (isProcessed.current) return;
    isProcessed.current = true;

    const params = new URLSearchParams(window.location.search);
    
    // 학교 메일 가드 에러 처리
    const error = params.get("error");
    if (error === "school_only") {
      alert("가톨릭대학교 학생 메일(@catholic.ac.kr)로 로그인해 주세요.");
      navigate(PATH.LOGIN);
      return;
    }

    // 2. 토큰 추출 및 초강력 세척 저장
    let token = params.get("access_token") || params.get("token") || params.get("accessToken");

    if (token) {
      // 앞뒤 찌꺼기 완벽 세척
      token = token.replace(/^(Bearer\s+)+/i, '')
                   .replace(/^"|"$/g, '')
                   .replace(/[\r\n\t]/g, '')
                   .trim();
                   
      localStorage.setItem("access_token", token);
      console.log("🎯 [토큰 교정 및 저장 성공]:", token);

      // 토큰 장착 완료 후 가입 페이지로 부드럽게 안전 이동 (0.15초 지연)
      setTimeout(() => {
        navigate(PATH.SIGNUP);
      }, 150);

    } else {
      console.error("❌ 주소창에서 토큰을 찾을 수 없습니다.");
      alert("로그인 세션 획득에 실패했습니다. 다시 시도해 주세요.");
      navigate(PATH.LOGIN);
    }
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#5C7CFF] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xl font-bold text-[#5C7CFF] animate-pulse">
          인증 주소를 교정하고 세션을 획득하는 중입니다...
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;