import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import backIcon from "../../assets/back.svg";
import ProjectCard from "../../components/projectCard";
import ReviewModal from "../../components/reviewModal";
import { recruitsApi } from "../../api/recruits";
import { reviewsApi } from "../../api/reviews";

const USE_MOCK_DATA = false;

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

type MockParticipatedProject = {
  recruitId: number;
  category: string;
  deadline: string;
  title: string;
  description: string;
  totalHeadcount: number;
  skills: string[];
  writer: string;
  department: string;
  members: ReviewMember[];
};

const mockParticipatedProjects: MockParticipatedProject[] = [
  {
    recruitId: 101,
    category: "프로젝트",
    deadline: "2026-04-10",
    title: "AI 면접 서비스 MVP 개발",
    description: "프론트엔드와 백엔드가 함께 진행한 프로젝트입니다.",
    totalHeadcount: 4,
    skills: ["React", "TypeScript", "Spring"],
    writer: "김가톨릭",
    department: "컴퓨터정보공학부",
    members: [
      { id: 2, name: "방찬희", role: "Backend" },
      { id: 3, name: "김수진", role: "Designer" },
      { id: 4, name: "박민수", role: "Frontend" },
    ],
  },
  {
    recruitId: 102,
    category: "스터디",
    deadline: "2026-04-25",
    title: "정처기 한방 합격 스터디",
    description: "정처기 필기와 실기를 함께 준비한 스터디입니다.",
    totalHeadcount: 5,
    skills: ["CS", "알고리즘", "정처기"],
    writer: "릴리",
    department: "미디어기술콘텐츠학과",
    members: [
      { id: 5, name: "이영희", role: "스터디원" },
      { id: 6, name: "최민호", role: "스터디원" },
    ],
  },
];

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
    queryFn: () => recruitsApi.getMyRecruits({ page: 0, size: 20 }),
    enabled: !USE_MOCK_DATA,
  });

  const projects = USE_MOCK_DATA
    ? mockParticipatedProjects
    : participatedProjects?.recruits ?? [];

  const openReviewModal = (
    recruitId: number,
    projectTitle: string,
    members: ReviewMember[],
  ) => {
    if (!members.length) {
      alert("리뷰를 작성할 팀원 정보가 없습니다.");
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

      if (USE_MOCK_DATA) {
        console.log("리뷰 작성 더미 제출");
        console.log("recruitPostId:", selectedRecruitId);
        console.log("reviews:", reviews);
        alert("더미 리뷰 제출 완료! 콘솔을 확인해주세요.");
        closeReviewModal();
        return;
      }

      console.log("리뷰 작성 실제 제출");
      console.log("recruitPostId:", selectedRecruitId);
      console.log("reviews:", reviews);

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

  const getCategoryText = (project: any) => {
    return (
      project.recruitCategory ||
      project.activityCategory ||
      project.category ||
      project.type ||
      "프로젝트"
    );
  };

  const getDescription = (project: any) => {
    if (project.description) return project.description;
    if (project.content) return project.content;
    if (project.tag) return project.tag;
    if (project.department) {
      return `${project.department}에서 진행 중인 프로젝트입니다.`;
    }

    return "내가 참여한 프로젝트입니다.";
  };

  const getWriter = (project: any) => {
    return project.writer || project.author?.nickname || "작성자";
  };

  const getDepartment = (project: any) => {
    return project.department || project.author?.departmentName || "";
  };

  const getTotalHeadcount = (project: any) => {
    return project.totalHeadcount || project.recruitCount || 0;
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

    if (project.author?.memberId) {
      return [
        {
          id: project.author.memberId,
          name: project.author.nickname ?? "팀원",
          role: project.category ?? project.role ?? "팀원",
        },
      ];
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
          {!USE_MOCK_DATA && isLoading && (
            <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
              참여한 프로젝트를 불러오는 중입니다.
            </div>
          )}

          {!USE_MOCK_DATA && isError && !isLoading && (
            <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#EF4444] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
              참여한 프로젝트를 불러오지 못했습니다.
            </div>
          )}

          {!isLoading && !isError && !projects.length && (
            <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[18px] text-center text-[14px] font-medium leading-[20px] text-[#64748B] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
              참여한 프로젝트가 없습니다.
            </div>
          )}

          {projects.length > 0 && (
            <div className="flex flex-col gap-[12px]">
              {projects.map((project: any) => (
                <ProjectCard
                  key={project.recruitId}
                  category={getCategoryText(project)}
                  dDay={calculateDday(project.deadline)}
                  title={project.title}
                  description={getDescription(project)}
                  recruitCount={getTotalHeadcount(project)}
                  techStacks={project.skills ?? []}
                  writer={getWriter(project)}
                  department={getDepartment(project)}
                  buttonLabel="팀원 리뷰달기"
                  onButtonClick={() =>
                    openReviewModal(
                      project.recruitId,
                      project.title,
                      getMembers(project),
                    )
                  }
                />
              ))}
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