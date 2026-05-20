import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import { PATH } from "../components/path";

const OAuthCallback: React.FC = () => {
  const isProcessed = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isProcessed.current) return;
    isProcessed.current = true;

    const params = new URLSearchParams(window.location.search);
    
    // 1. 학교 메일 체크 에러 처리
    const error = params.get("error");
    if (error === "school_only") {
      alert("가톨릭대학교 학생 메일(@catholic.ac.kr)로 로그인해 주세요.");
      navigate(PATH.LOGIN);
      return;
    }

    // 2. 토큰 추출 및 초강력 세척 저장
    let token = params.get("access_token") || params.get("token");

    if (token) {
      // ⭕ [세척 강화] Bearer 문구, 양끝 따옴표, 보이지 않는 모든 줄바꿈 및 특수 공백 찌꺼기(\s)를 완벽하게 제거합니다.
      token = token.replace(/^(Bearer\s+)+/i, '')
                   .replace(/^"|"$/g, '')
                   .replace(/[\r\n\t]/g, '')
                   .trim();
                   
      localStorage.setItem("access_token", token);
      
      console.log("✅ 세척 완료된 청정 토큰 저장 완료. 가드 인식을 위해 미세 지연 후 이동합니다.");

      // 토큰이 브라우저 메모리에 유효하게 등록될 시간을 벌어줍니다 (0.15초 뒤 안전 이동)
      setTimeout(() => {
        navigate(PATH.SIGNUP);
      }, 150);

    } else {
      console.error("❌ 토큰 없음");
      navigate(PATH.LOGIN);
    }
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#5C7CFF] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xl font-bold text-[#5C7CFF] animate-pulse">
          가입 여부를 확인 중입니다...
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;