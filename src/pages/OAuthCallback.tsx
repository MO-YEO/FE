import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import { PATH } from "../components/path";
import { membersApi } from "../api/member"; // ✅ 경로 확인 필요

const OAuthCallback: React.FC = () => {
  const isProcessed = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isProcessed.current) return;
    isProcessed.current = true;

    const params = new URLSearchParams(window.location.search);
    
    // 1. 가톨릭대 메일 체크 에러 처리
    const error = params.get("error");
    if (error === "school_only") {
      alert("가톨릭대학교 학생 메일(@catholic.ac.kr)로 로그인해 주세요.");
      navigate(PATH.LOGIN);
      return;
    }

    // 2. 토큰 추출 및 저장
    let token = params.get("access_token") || params.get("token");

    if (token) {
      token = token.replace(/^(Bearer\s+)+/i, '').replace(/^"|"$/g, '').trim();
      localStorage.setItem("access_token", token);
      
      console.log("✅ 토큰 저장 완료");

      // 🚀 [핵심] 여기서 바로 홈으로 가지 않고, 유저 상태를 확인합니다.
      checkUserStatus();
    } else {
      console.error("❌ 토큰 없음");
      navigate(PATH.LOGIN);
    }
  }, []);

  // ✅ 신규 유저인지 기존 유저인지 판별하는 함수
  const checkUserStatus = async () => {
    try {
      // 서버에 내 프로필 정보 요청
      const profile = await membersApi.getMyProfile();

      // 프로필에 닉네임이 있다면 이미 가입한 유저 -> 홈으로!
      if (profile && profile.nickname) {
        navigate(PATH.SIGNUP);
      } else {
        // 토큰은 있지만 프로필 정보가 없다면 -> 계정 생성 페이지로!
        navigate(PATH.SIGNUP);
      }
    } catch (err: any) {
      // 404 에러 등이 발생하면 프로필이 없는 신규 유저로 판단
      console.log("신규 유저 감지:", err);
      navigate(PATH.SIGNUP);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
      <div className="text-xl font-bold text-[#5C7CFF] animate-pulse">
        사용자 정보를 확인 중입니다...
      </div>
    </div>
  );
};

export default OAuthCallback;