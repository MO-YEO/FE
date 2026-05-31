import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              <br />
              한 번에 관리해보세요.
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

        <div className="mt-[32px] flex flex-col gap-[16px]">
          <div className="flex items-center justify-between rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] px-[16px] py-[12px]">
            <label className="flex flex-1 cursor-pointer items-center gap-[10px] text-[13px] font-medium text-[#475569]">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="h-[18px] w-[18px] cursor-pointer rounded-[6px] border-[#CBD5E1] text-[#5C7CFF] focus:ring-[#5C7CFF]"
              />
              <span>서비스 이용약관 및 개인정보 처리방침 동의</span>
            </label>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-[12px] font-bold text-[#64748B] underline"
            >
              보기
            </button>
          </div>

          <Button
            variant="primary"
            size="lg"
            className={`flex h-[56px] w-full items-center justify-center rounded-[14px] text-[16px] font-bold text-white transition-all active:scale-[0.98] ${
              isAgreed
                ? "bg-[#5C7CFF] shadow-[0_12px_24px_rgba(92,124,255,0.24)]"
                : "bg-[#94A3B8] opacity-50 cursor-not-allowed"
            }`}
            disabled={!isAgreed}
            onClick={() => navigate("/login")}
          >
            <span className="flex items-center justify-center gap-2 text-white">
              시작하기
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

          <p className="text-center text-[12px] font-medium text-[#94A3B8]">
            가톨릭대학교 학생 전용 서비스입니다.
          </p>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[20px]">
          <div className="flex h-[80vh] w-full max-w-[380px] flex-col rounded-[24px] bg-white p-[24px] shadow-2xl">
            <div className="mb-[16px] flex items-center justify-between shrink-0">
              <h2 className="text-[18px] font-bold text-[#111827]">서비스 약관 및 방침</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-[4px] text-left text-[13px] leading-[22px] text-[#475569]">
              <div className="mb-6">
                <h3 className="text-[14px] font-bold text-[#111827] mb-2">1. 서비스 이용약관 (Terms of Service)</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-[#1D293D]">제1조 (목적)</h4>
                    <p>본 약관은 가톨릭대학교 학생 전용 팀 빌딩 플랫폼 '모여(MO-YEO)'(이하 '서비스')가 제공하는 인터넷 관련 서비스의 이용 조건 및 절차, 이용자와 관리자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1D293D]">제2조 (이용 자격 및 회원가입)</h4>
                    <p>본 서비스는 가톨릭대학교 재학생 및 휴학생의 학업적 협업을 지원하기 위한 폐쇄형 플랫폼입니다.</p>
                    <p>회원가입은 구글 OAuth 2.0 인증을 거친 후, 사용자의 이메일 도메인이 가톨릭대학교 공식 학생 메일 계정(@catholic.ac.kr)인 경우에만 승인 및 완료됩니다. 학교 도메인이 아닌 경우 이용 자격이 제한됩니다.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1D293D]">제3조 (이용자의 의무 및 커뮤니티 가이드라인)</h4>
                    <p>이용자는 플랫폼 내 게시판, 프로젝트 모집 공고, 댓글 등 모든 영역에서 타인을 비방, 비하, 모욕하거나 허위 사실을 유포하는 행위를 해서는 안 됩니다.</p>
                    <p>상호 리뷰 시스템 이용 시, 객체적이고 사실에 기반한 평가만을 작성해야 하며, 개인적인 감정이나 악의적인 목적으로 허위 평가를 기재해서는 안 됩니다.</p>
                    <p>서비스 내에서 광고, 홍보, 사기 행위 등 학업 및 팀 빌딩 목적에 부합하지 않는 활동을 금지합니다.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1D293D]">제4조 (이용 제한 및 계정 제재)</h4>
                    <p>제3조의 의무를 위반하여 타인에게 지속적인 피해를 주거나 커뮤니티의 건전한 생태계를 훼손한 유저에 대하여, 관리자는 사전 통보 후 또는 긴급할 경우 즉시 계정 정지 및 서비스 이용 제한 조치를 취할 수 있습니다.</p>
                    <p>무임승차 방지를 위한 상호 리뷰 누적 점수가 기준치 이하로 지속될 경우, 매칭 시스템 이용에 패널티가 부과될 수 있습니다.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1D293D]">제5조 (책임의 한계 및 면책 조항)</h4>
                    <p>본 서비스는 가톨릭대학교 학생 간의 원활한 팀원 매칭을 위한 정보 공유 환경만을 제공합니다.</p>
                    <p>팀 매칭 완료 이후 발생하는 팀원 간의 갈등, 프로젝트 참여도(무임승차 행위 등), 과제 결과물 및 학점 리스크 등 실제 수행 과정에서 발생하는 모든 문제에 대해 본 개발 팀 및 서비스 관리자는 어떠한 법적, 행정적 책임도 지지 않습니다.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] pt-4 mb-2">
                <h3 className="text-[14px] font-bold text-[#111827] mb-2">2. 개인정보 처리방침 (Privacy Policy)</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-[#1D293D]">제1조 (수집하는 개인정보 항목)</h4>
                    <p>본 서비스는 회원가입 및 학생 인증, 원활한 서비스 제공을 위해 구글 소셜 로그인 연동 시 다음과 같은 최소한의 개인정보를 수집합니다.</p>
                    <p className="font-medium text-[#111827]">필수 수집 항목: 구글 계정 이메일 주소(가톨릭대 공식 도메인), 프로필 닉네임, 프로필 이미지 정보</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1D293D]">제2조 (개인정보의 수집 및 이용 목적)</h4>
                    <p>수집된 개인정보는 다음의 목적 외의 용도로는 사용되지 않으며, 목적이 변경될 경우 사전 동의를 구할 예정입니다.</p>
                    <p>회원 관리: 가톨릭대학교 학생 여부 식별 및 인증, 본인 확인, 부적절 사용자의 서비스 부정이용 방지</p>
                    <p>서비스 기능 제공: 프로젝트 모집글 작성 및 지원자 관리, 게시판 게시글 및 댓글 등록, 상호 리뷰 점수 매칭 및 프로필 반영</p>
                    <p>소통 및 민원 처리: 문의하기 기능을 통한 사용자 요구사항 회신 및 공지사항 전달</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1D293D]">제3조 (개인정보의 보유 및 이용 기간)</h4>
                    <p>이용자의 개인정보는 서비스 이용 회원 자격을 유지하는 기간 동안에만 보유 및 이용됩니다.</p>
                    <p>이용자가 회원 탈퇴를 요청하거나, 본 프로젝트(학기별 캡스톤 디자인 및 공모전 제출 등)의 최종 운영이 종료되는 시점에 수집된 데이터베이스 내 개인정보는 즉시 완전 파기됩니다.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1D293D]">제4조 (개인정보의 제3자 제공에 관한 사항)</h4>
                    <p>본 서비스는 이용자의 개인정보를 제2조에서 명시한 범위 내에서만 처리하며, 이용자의 사전 동의 없이는 원칙적으로 외부에 공개하거나 제3자에게 제공하지 않습니다. 다만, 관련 법령의 규정에 의하여 법법기관의 요구가 있는 경우는 예외로 합니다.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="mt-[20px] shrink-0 flex h-[48px] w-full items-center justify-center rounded-[14px] bg-[#5C7CFF] text-[14px] font-bold text-white transition-transform active:scale-[0.98]"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Onboarding;