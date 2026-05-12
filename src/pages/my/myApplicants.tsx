import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import backIcon from "../../assets/back.svg";
import ApplicantCard from "../../components/applicantCard";
import { recruitsApi } from "../../api/recruits";
import type { RecruitApplicant } from "../../types";

export default function MyApplicants() {
  const navigate = useNavigate();
  const { recruitId } = useParams();

  const parsedRecruitId = Number(recruitId);

  const {
    data: applicationsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recruitApplications", parsedRecruitId],
    queryFn: () =>
      recruitsApi.getRecruitApplications(parsedRecruitId, {
        page: 0,
        size: 20,
      }),
    enabled: Number.isFinite(parsedRecruitId) && parsedRecruitId > 0,
  });

  const getStatusText = (status?: string) => {
    if (status === "APPLIED") return "지원 완료";
    if (status === "ACCEPTED") return "합격";
    if (status === "REJECTED") return "불합격";
    if (status === "CANCELED") return "지원 취소";
    return status || "지원 상태 없음";
  };

  const formatDate = (date?: string) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] bg-[#F8FAFC] pb-[88px]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="flex h-[96px] items-end px-[16px] pb-[20px] pt-[40px]">
          <button type="button" onClick={() => navigate(-1)}>
            <img src={backIcon} alt="뒤로가기" className="h-[24px] w-[24px]" />
          </button>

          <div className="flex flex-1 justify-center">
            <span className="text-[20px] font-bold leading-[28px] text-[#000000]">
              지원자 확인하기
            </span>
          </div>

          <div className="h-[24px] w-[24px]" />
        </div>
      </header>

      <section className="px-[16px] py-[16px]">
        {!Number.isFinite(parsedRecruitId) || parsedRecruitId <= 0 ? (
          <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#EF4444] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            모집글 정보를 찾을 수 없습니다.
          </div>
        ) : null}

        {isLoading && (
          <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            지원자 목록을 불러오는 중입니다.
          </div>
        )}

        {isError && !isLoading && (
          <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#EF4444] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            지원자 목록을 불러오지 못했습니다.
          </div>
        )}

        {!isLoading &&
          !isError &&
          Number.isFinite(parsedRecruitId) &&
          parsedRecruitId > 0 &&
          !applicationsData?.applications?.length && (
            <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
              아직 지원자가 없습니다.
            </div>
          )}

        {!isLoading && !isError && applicationsData?.applications?.length ? (
          <div className="flex flex-col gap-[12px]">
            {applicationsData.applications.map(
              (application: RecruitApplicant) => (
                <ApplicantCard
                  key={application.applicationId}
                  name={application.applicant.nickname}
                  role={getStatusText(application.status)}
                  intro={`지원일: ${formatDate(application.createdAt)}`}
                  techStacks={[]}
                  email={application.applicant.contactEmail}
                  matchRate={0}
                  reviewScore={0}
                  reviewCount={0}
                  reviews={[]}
                />
              ),
            )}
          </div>
        ) : null}
      </section>
    </main>
  );
}