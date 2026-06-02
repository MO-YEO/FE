import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../components/path";
import { membersApi } from "../api/member";

const OAuthCallback: React.FC = () => {
  const isProcessed = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isProcessed.current) return;
    isProcessed.current = true;

    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));

    const error = searchParams.get("error") || hashParams.get("error");

    if (error === "school_only") {
      alert("가톨릭대학교 학생 메일(@catholic.ac.kr)로 로그인해 주세요.");
      navigate(PATH.LOGIN, { replace: true });
      return;
    }

    let token =
      searchParams.get("access_token") ||
      searchParams.get("token") ||
      searchParams.get("accessToken") ||
      hashParams.get("access_token") ||
      hashParams.get("token") ||
      hashParams.get("accessToken");

    if (token) {
      token = token
        .replace(/^Bearer\s+/i, "")
        .replace(/^"|"$/g, "")
        .replace(/[\r\n\t]/g, "")
        .trim();

      localStorage.setItem("access_token", token);

      // 토큰 저장 즉시 프로필 조회를 실행하여 유저 상태 분기 처리
      (async () => {
        try {
          const profile = await membersApi.getMyProfile();
          
          // 기존에 가입하여 닉네임 정보가 등록되어 있는 유저인 경우
          if (profile && profile.nickname) {
            navigate(PATH.HOME, { replace: true });
          } else {
            // 완전 최초 로그인 상태인 유저인 경우
            navigate(PATH.SIGNUP, { replace: true });
          }
        } catch (e) {
          // 토큰은 있으나 프로필 조회가 실패한 경우 가입 폼으로 방어 유도
          navigate(PATH.SIGNUP, { replace: true });
        }
      })();
    } else {
      console.error("❌ 토큰 추출 실패");
      alert("토큰을 받아오지 못했습니다.");
      navigate(PATH.LOGIN, { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#5C7CFF] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xl font-bold text-[#5C7CFF] animate-pulse">
          로그인 처리 중입니다...
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;