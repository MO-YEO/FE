import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../components/path";

const OAuthCallback: React.FC = () => {
  const isProcessed = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isProcessed.current) return;
    isProcessed.current = true;

    console.log("🌍 현재 전체 URL:", window.location.href);
    console.log("🌍 search:", window.location.search);
    console.log("🌍 hash:", window.location.hash);

    const searchParams = new URLSearchParams(window.location.search);

    const hashParams = new URLSearchParams(
      window.location.hash.replace("#", "")
    );

    for (const [key, value] of searchParams.entries()) {
      console.log("📦 search 파라미터:", key, value);
    }

    for (const [key, value] of hashParams.entries()) {
      console.log("📦 hash 파라미터:", key, value);
    }

    const error =
      searchParams.get("error") || hashParams.get("error");

    if (error === "school_only") {
      alert("가톨릭대학교 학생 메일(@catholic.ac.kr)로 로그인해 주세요.");
      navigate(PATH.LOGIN);
      return;
    }

    let token =
      searchParams.get("access_token") ||
      searchParams.get("token") ||
      searchParams.get("accessToken") ||
      hashParams.get("access_token") ||
      hashParams.get("token") ||
      hashParams.get("accessToken");

    console.log("🎟️ 추출된 원본 토큰:", token);

    if (token) {
      token = token
        .replace(/^Bearer\s+/i, "")
        .replace(/^"|"$/g, "")
        .replace(/[\r\n\t]/g, "")
        .trim();

      localStorage.setItem("access_token", token);

      console.log(
        "✅ 저장 후 localStorage:",
        localStorage.getItem("access_token")
      );

      setTimeout(() => {
        navigate(PATH.SIGNUP);
      }, 200);
    } else {
      console.error("❌ 토큰 추출 실패");
      alert("토큰을 받아오지 못했습니다.");
      navigate(PATH.LOGIN);
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