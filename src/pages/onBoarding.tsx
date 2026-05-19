import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] px-6 py-8 font-sans">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[1100px] flex-col">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#5C7CFF] shadow-[0_8px_24px_rgba(92,124,255,0.25)]">
              <img
                src="/svgs/onboarding/Container.svg"
                alt="MO-YEO Logo"
                className="h-6 w-6 object-contain"
              />
            </div>

            <div>
              <h1 className="text-[22px] font-black italic leading-none tracking-[-0.04em] text-[#111827]">
                MO-YEO
              </h1>
              <p className="mt-1 text-[12px] font-medium text-[#64748B]">
                가톨릭대학교 학생 전용
              </p>
            </div>
          </div>
        </header>

        <section className="flex flex-1 items-center justify-center py-12">
          <div className="grid w-full items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
            <div className="text-center md:text-left">
              <div className="mb-5 inline-flex items-center rounded-full border border-[#DBEAFE] bg-white px-4 py-2 text-[13px] font-semibold text-[#2563EB] shadow-sm">
                팀 빌딩부터 코드 리뷰까지 한 곳에서
              </div>

              <h2 className="text-[42px] font-extrabold leading-[1.18] tracking-[-0.05em] text-[#111827] sm:text-[52px]">
                검증된 팀원을
                <br />
                만나는 가장
                <br />
                스마트한 방법
              </h2>

              <p className="mx-auto mt-6 max-w-[480px] text-[16px] font-medium leading-[1.8] text-[#64748B] md:mx-0">
                프로젝트, 스터디, 공모전까지.
                <br />
                함께할 팀원을 찾고 지원자 리뷰로 더 안전하게 팀을 구성해보세요.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
                <Button
                  variant="primary"
                  size="lg"
                  className="h-[56px] rounded-[16px] bg-[#5C7CFF] px-8 text-[16px] font-bold text-white shadow-[0_12px_24px_rgba(92,124,255,0.28)]"
                  onClick={() => navigate("/login")}
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
              </div>

              <p className="mt-5 text-[13px] font-medium text-[#94A3B8]">
                가톨릭대학교 학생 전용 서비스입니다.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#EEF2FF]">
                    <img
                      src="/svgs/onboarding/Container2.svg"
                      alt="팀 매칭"
                      className="h-7 w-7"
                    />
                  </div>

                  <div>
                    <h3 className="text-[18px] font-bold text-[#111827]">
                      팀 매칭
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.7] text-[#64748B]">
                      관심 분야와 기술 스택을 기준으로 나에게 맞는 팀원을
                      빠르게 찾을 수 있어요.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#F5F3FF]">
                    <img
                      src="/svgs/onboarding/Container3.svg"
                      alt="리뷰 문화"
                      className="h-7 w-7"
                    />
                  </div>

                  <div>
                    <h3 className="text-[18px] font-bold text-[#111827]">
                      리뷰 기반 신뢰
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.7] text-[#64748B]">
                      함께한 팀원에게 리뷰를 남기고, 지원자의 협업 경험을
                      확인할 수 있어요.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#ECFEFF]">
                    <span className="text-[24px]">💬</span>
                  </div>

                  <div>
                    <h3 className="text-[18px] font-bold text-[#111827]">
                      모집글과 게시판
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.7] text-[#64748B]">
                      모집글 작성, 지원 관리, 정보 공유까지 하나의 서비스에서
                      관리할 수 있어요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="pb-2 text-center text-[12px] font-medium text-[#CBD5E1]">
          © 2026 MO-YEO. All rights reserved.
        </footer>
      </div>
    </main>
  );
};

export default Onboarding;