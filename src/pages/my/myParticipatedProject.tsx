import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import backIcon from "../../assets/back.svg";
import ProjectCard from "../../components/projectCard";
import ReviewModal from "../../components/reviewModal";
import { recruitsApi } from "../../api/recruits";
import { reviewsApi } from "../../api/reviews";

type ReviewMember = {
  id: number;
  name: string;
  role: string;
};

type ReviewValue = {
  memberId: number;
  rating: number;
  reviewText: string;
};

export default function MyParticipatedProject() {
  const navigate = useNavigate();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRecruitId, setSelectedRecruitId] = useState<number | null>(
    null,
  );
  const [selectedProjectTitle, setSelectedProjectTitle] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<ReviewMember[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const {
    data: participatedProjects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myParticipatedProjectsPage"],
    queryFn: () => recruitsApi.getAppliedRecruits({ page: 0, size: 20 }),
  });

  const projects = participatedProjects?.recruits ?? [];

  const openReviewModal = (
    recruitId: number,
    projectTitle: string,
    members: ReviewMember[],
  ) => {
    if (!members.length) {
      alert(
        "리뷰를 작성할 팀원 정보가 없습니다. 백엔드 응답에 팀원 목록이 필요합니다.",
      );
      return;
    }

    setSelectedRecruitId(recruitId);
    setSelectedProjectTitle(projectTitle);
    setSelectedMembers(members);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedRecruitId(null);
    setSelectedProjectTitle("");
    setSelectedMembers([]);
  };

  const handleSubmitReviews = async (reviews: ReviewValue[]) => {
    if (!selectedRecruitId) {
      alert("프로젝트 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      setIsSubmittingReview(true);

      await Promise.all(
        reviews.map((review) =>
          reviewsApi.createReview({
            targetUserId: review.memberId,
            recruitPostId: selectedRecruitId,
            rating: review.rating,
            content: review.reviewText,
          }),
        ),
      );

      alert("팀원 리뷰가 작성되었습니다.");
      closeReviewModal();
    } catch (error) {
      console.error("리뷰 작성 실패:", error);
      alert("리뷰 작성에 실패했습니다.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const calculateDday = (deadline?: string) => {
    if (!deadline) return "D-?";

    const today = new Date();
    const endDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDay > 0) return `D-${diffDay}`;
    if (diffDay === 0) return "D-DAY";
    return "마감";
  };

  const getCategoryText = (type?: string) => {
    if (type === "PROJECT") return "프로젝트";
    if (type === "STUDY") return "스터디";
    if (type === "CONTEST") return "공모전";
    if (type === "CLASS") return "수업";
    return type || "프로젝트";
  };

  const getApplicationStatusText = (status?: string) => {
    if (status === "APPLIED") return "지원 완료";
    if (status === "ACCEPTED") return "합격";
    if (status === "REJECTED") return "불합격";
    if (status === "CANCELED") return "지원 취소";
    return status || "지원 완료";
  };

  const getDescription = (project: any) => {
    return `지원 상태: ${getApplicationStatusText(project.applicationStatus)}`;
  };

  const getMembers = (project: any): ReviewMember[] => {
    if (project.members?.length) {
      return project.members.map((member: any) => ({
        id: member.memberId ?? member.id,
        name: member.nickname ?? member.name ?? "팀원",
        role: member.role ?? "팀원",
      }));
    }

    if (project.teamMembers?.length) {
      return project.teamMembers.map((member: any) => ({
        id: member.memberId ?? member.id,
        name: member.nickname ?? member.name ?? "팀원",
        role: member.role ?? "팀원",
      }));
    }

    if (project.participants?.length) {
      return project.participants.map((member: any) => ({
        id: member.memberId ?? member.id,
        name: member.nickname ?? member.name ?? "팀원",
        role: member.role ?? "팀원",
      }));
    }

    return [];
  };

  return (
    <>
      <main className="mx-auto min-h-screen w-full max-w-[430px] bg-[#F8FAFC] pb-[88px]">
        <header className="border-b border-[#E5E7EB] bg-white">
          <div className="flex h-[96px] items-end px-[16px] pb-[20px] pt-[40px]">
            <button type="button" onClick={() => navigate(-1)}>
              <img src={backIcon} alt="뒤로가기" className="h-[24px] w-[24px]" />
            </button>

            <div className="flex flex-1 justify-center">
              <span className="text-[20px] font-bold leading-[28px] text-[#000000]">
                내가 참여한 프로젝트
              </span>
            </div>

            <div className="h-[24px] w-[24px]" />
          </div>
        </header>

        <section className="px-[16px] py-[16px]">
          {isLoading && (
            <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
              참여한 프로젝트를 불러오는 중입니다.
            </div>
          )}

          {isError && !isLoading && (
            <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#EF4444] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
              참여한 프로젝트를 불러오지 못했습니다.
            </div>
          )}

          {!isLoading && !isError && projects.length === 0 && (
            <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[18px] text-center text-[14px] font-medium leading-[20px] text-[#64748B] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
              참여한 프로젝트가 없습니다.
            </div>
          )}

          {!isLoading && !isError && projects.length > 0 && (
            <div className="flex flex-col gap-[12px]">
              {projects.map((project: any) => {
                const members = getMembers(project);

                return (
                  <ProjectCard
                    key={project.recruitId}
                    category={getCategoryText(project.type)}
                    dDay={calculateDday(project.deadline)}
                    title={project.title}
                    description={getDescription(project)}
                    recruitCount={0}
                    techStacks={project.skills ?? []}
                    writer="작성자"
                    department=""
                    buttonLabel="리뷰쓰기"
                    onButtonClick={() =>
                      openReviewModal(project.recruitId, project.title, members)
                    }
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
        projectTitle={selectedProjectTitle}
        members={selectedMembers}
        onSubmit={handleSubmitReviews}
      />

      {isSubmittingReview && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30">
          <div className="rounded-[14px] bg-white px-[20px] py-[14px] text-[14px] font-semibold text-[#111827]">
            리뷰 제출 중...
          </div>
        </div>
      )}
    </>
  );
}