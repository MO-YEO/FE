import React from "react";
import Button from "../components/button";

const Login: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href =
      "http://3.37.55.120.nip.io:8080/oauth2/authorization/google";
  };

  return (
    <main className="min-h-screen w-full bg-white font-sans">
      <section className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-[28px] py-[56px]">
        <div className="flex flex-1 flex-col items-center justify-center">
            <img
              src="/svgs/onboarding/Container.svg"
              alt="MO-YEO Logo"
              className="h-15 w-15 object-contain"
            />


          <h1 className="mt-[28px] text-[32px] font-black italic leading-none tracking-[-0.04em] text-[#111827]">
            MO-YEO
          </h1>

          <p className="mt-[8px] text-[14px] font-semibold text-[#64748B]">
            가톨릭대학교 학생 전용
          </p>

          <div className="mt-[64px] text-center">
            <h2 className="text-[34px] font-extrabold leading-[1.28] tracking-[-0.04em] text-[#111827]">
              검증된 팀원을
              <br />
              만나는 가장
              <br />
              스마트한 방법
            </h2>

            <p className="mt-[24px] text-[15px] font-medium leading-[1.8] text-[#64748B]">
              기술 스택 기반 팀 빌딩부터
              <br />
              지원자 리뷰와 정보 공유까지
              <br />한 번에 관리해보세요.
            </p>
          </div>

          <div className="mt-[56px] flex w-full flex-col gap-[12px]">
            <div className="flex items-center gap-[12px] rounded-[14px] bg-[#F8FAFC] px-[16px] py-[14px]">
              <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#EEF2FF]">
                <img
                  src="/svgs/onboarding/Container2.svg"
                  alt="팀원 찾기"
                  className="h-5 w-5"
                />
              </div>

              <div>
                <p className="text-[14px] font-bold leading-[20px] text-[#111827]">
                  팀원 찾기
                </p>
                <p className="mt-[2px] text-[12px] leading-[18px] text-[#64748B]">
                  분야와 기술 스택으로 팀원을 찾아요.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-[12px] rounded-[14px] bg-[#F8FAFC] px-[16px] py-[14px]">
              <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#F5F3FF]">
                <img
                  src="/svgs/onboarding/Container3.svg"
                  alt="리뷰 기반 신뢰"
                  className="h-5 w-5"
                />
              </div>

              <div>
                <p className="text-[14px] font-bold leading-[20px] text-[#111827]">
                  리뷰 기반 신뢰
                </p>
                <p className="mt-[2px] text-[12px] leading-[18px] text-[#64748B]">
                  팀원 리뷰로 더 안전하게 선택해요.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[32px]">
          <Button
            variant="primary"
            size="lg"
            className="flex h-[56px] w-full items-center justify-center rounded-[14px] bg-[#5C7CFF] text-[16px] font-bold text-white shadow-[0_12px_24px_rgba(92,124,255,0.24)] transition-all active:scale-[0.98]"
            onClick={handleGoogleLogin}
          >
            <span className="flex items-center justify-center gap-2 text-white">
              구글 로그인
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Button>

          <p className="mt-[18px] text-center text-[12px] font-medium text-[#94A3B8]">
            가톨릭대학교 학생 전용 서비스입니다.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;