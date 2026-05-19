import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import backIcon from "../../assets/back.svg";
import ApplicantCard from "../../components/applicantCard";
import { recruitsApi } from "../../api/recruits";
import { reviewsApi, type ApplicantReview } from "../../api/reviews";
import type { RecruitApplicant } from "../../types";

type NoticeState = {
  type: "success" | "error";
  message: string;
} | null;

type ReviewModalState = {
  applicantName: string;
  reviews: ApplicantReview[];
} | null;

export default function MyApplicants() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { recruitId } = useParams();

  const parsedRecruitId = Number(recruitId);

  const [notice, setNotice] = useState<NoticeState>(null);
  const [reviewModal, setReviewModal] = useState<ReviewModalState>(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);

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

  const updateApplicationMutation = useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: number;
      status: "ACCEPTED" | "REJECTED";
    }) =>
      recruitsApi.updateApplicationStatus(parsedRecruitId, applicationId, {
        status,
      }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["recruitApplications", parsedRecruitId],
      });

      setNotice({
        type: "success",
        message:
          variables.status === "ACCEPTED"
            ? "지원자를 승인했습니다."
            : "지원자를 거절했습니다.",
      });
    },

    onError: (error) => {
      console.error("지원 승인/거절 실패:", error);

      setNotice({
        type: "error",
        message: "처리 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    },
  });

  const getStatusText = (status?: string) => {
    if (status === "APPLIED") return "지원 완료";
    if (status === "ACCEPTED") return "승인됨";
    if (status === "REJECTED") return "거절됨";
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

  const handleApprove = (application: RecruitApplicant) => {
    updateApplicationMutation.mutate({
      applicationId: application.applicationId,
      status: "ACCEPTED",
    });
  };

  const handleReject = (application: RecruitApplicant) => {
    updateApplicationMutation.mutate({
      applicationId: application.applicationId,
      status: "REJECTED",
    });
  };

  const handleOpenReviews = async (application: RecruitApplicant) => {
    try {
      setIsReviewLoading(true);

      const reviews = await reviewsApi.getApplicantReviews(
        parsedRecruitId,
        application.applicant.memberId,
      );

      setReviewModal({
        applicantName: application.applicant.nickname,
        reviews,
      });
    } catch (error) {
      console.error("지원자 리뷰 조회 실패:", error);
      setNotice({
        type: "error",
        message: "지원자 리뷰를 불러오지 못했습니다.",
      });
    } finally {
      setIsReviewLoading(false);
    }
  };

  const isUpdating = updateApplicationMutation.isPending;

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-[430px] bg-[#F8FAFC] pb-[88px]">
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
          <div className="flex flex-col gap-[14px]">
            {applicationsData.applications.map(
              (application: RecruitApplicant) => {
                const isPending = application.status === "APPLIED";

                return (
                  <div key={application.applicationId} className="relative">
                    {isPending ? (
                      <div className="absolute right-[14px] top-[14px] z-10 flex gap-[6px]">
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleApprove(application)}
                          className="rounded-[8px] bg-[#2F6BFF] px-[10px] py-[6px] text-[11px] font-bold leading-none text-white shadow-sm disabled:opacity-50"
                        >
                          승인
                        </button>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleReject(application)}
                          className="rounded-[8px] bg-[#FEE2E2] px-[10px] py-[6px] text-[11px] font-bold leading-none text-[#DC2626] disabled:opacity-50"
                        >
                          거절
                        </button>
                      </div>
                    ) : (
                      <div className="absolute right-[14px] top-[14px] z-10 rounded-[8px] bg-[#F1F5F9] px-[10px] py-[6px] text-[11px] font-bold leading-none text-[#64748B]">
                        {getStatusText(application.status)}
                      </div>
                    )}

                    <ApplicantCard
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

                    <button
                      type="button"
                      onClick={() => handleOpenReviews(application)}
                      disabled={isReviewLoading}
                      className="
                        absolute bottom-[14px] right-[14px] z-10
                        rounded-[8px] border border-[#BFDBFE] bg-white
                        px-[12px] py-[7px]
                        text-[12px] font-bold leading-none text-[#2563EB]
                        shadow-sm disabled:opacity-50
                      "
                    >
                      {isReviewLoading ? "불러오는 중..." : "리뷰보기"}
                    </button>
                  </div>
                );
              },
            )}
          </div>
        ) : null}
      </section>

      {reviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 px-[24px]">
          <div className="w-full max-w-[340px] rounded-[18px] bg-white px-[20px] py-[22px] shadow-[0_12px_40px_rgba(15,23,42,0.22)]">
            <div className="flex items-start justify-between gap-[12px]">
              <div>
                <h3 className="text-[17px] font-bold leading-[24px] text-[#111827]">
                  지원자 리뷰
                </h3>
                <p className="mt-[4px] text-[13px] leading-[18px] text-[#64748B]">
                  {reviewModal.applicantName}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setReviewModal(null)}
                className="text-[20px] font-bold leading-none text-[#94A3B8]"
              >
                ×
              </button>
            </div>

            <div className="mt-[18px] max-h-[360px] overflow-y-auto">
              {reviewModal.reviews.length > 0 ? (
                <div className="flex flex-col gap-[10px]">
                  {reviewModal.reviews.map((review) => (
                    <div
                      key={review.reviewId}
                      className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] px-[14px] py-[12px]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-[13px] font-bold text-[#2563EB]">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(Math.max(0, 5 - review.rating))}
                        </div>

                        <span className="text-[11px] text-[#94A3B8]">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>

                      <p className="mt-[8px] whitespace-pre-line text-[13px] leading-[20px] text-[#334155]">
                        {review.content || "작성된 내용이 없습니다."}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[12px] bg-[#F8FAFC] px-[14px] py-[28px] text-center text-[13px] text-[#94A3B8]">
                  아직 작성된 리뷰가 없습니다.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setReviewModal(null)}
              className="mt-[18px] h-[44px] w-full rounded-[12px] bg-[#2F6BFF] text-[14px] font-bold text-white"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {notice && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/35 px-[24px]">
          <div className="w-full max-w-[320px] rounded-[18px] bg-white px-[20px] py-[24px] text-center shadow-[0_12px_40px_rgba(15,23,42,0.22)]">
            <div
              className={`mx-auto flex h-[44px] w-[44px] items-center justify-center rounded-full text-[22px] font-bold ${
                notice.type === "success"
                  ? "bg-[#EFF6FF] text-[#2F6BFF]"
                  : "bg-[#FEE2E2] text-[#DC2626]"
              }`}
            >
              {notice.type === "success" ? "✓" : "!"}
            </div>

            <p className="mt-[14px] text-[15px] font-semibold leading-[22px] text-[#111827]">
              {notice.message}
            </p>

            <button
              type="button"
              onClick={() => setNotice(null)}
              className="mt-[20px] h-[44px] w-full rounded-[12px] bg-[#2F6BFF] text-[14px] font-bold text-white"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </main>
  );
}