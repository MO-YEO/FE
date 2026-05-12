import React, { useEffect, useRef } from "react";

const OAuthCallback: React.FC = () => {
  // 실행 여부를 체크하기 위한 flag (Strict Mode 대응)
  const isProcessed = useRef(false);

  useEffect(() => {
    // 이미 처리가 시작되었다면 중단
    if (isProcessed.current) return;
    isProcessed.current = true;

    const params = new URLSearchParams(window.location.search);
    
    // 1. 가톨릭대 메일 미사용 에러 체크
    const error = params.get("error");
    if (error === "school_only") {
      alert("가톨릭대학교 학생 메일(@catholic.ac.kr)로만 이용 가능한 서비스입니다.\n가톨릭대 메일로 다시 로그인해 주세요.");
      
      //바로 로그인 화면으로 이동
      window.location.href = "/login"; 
      return; 
    }

    // 2. 토큰 추출 로직
    let token = params.get("access_token") || params.get("token");

    if (token) {
      token = token.replace(/^(Bearer\s+)+/i, '').replace(/^"|"$/g, '').trim();
      localStorage.setItem("access_token", token);
      
      console.log("✅ 토큰 저장 완료:", token);
      window.location.href = "/home";
    } else {
      console.error("❌ URL에 토큰이 없습니다.");
      // 필요시: window.location.href = "/login";
    }
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
      <div className="text-xl font-bold text-[#5C7CFF] animate-pulse">로그인 처리 중...</div>
    </div>
  );
};

export default OAuthCallback;