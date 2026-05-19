import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import backIcon from "../../assets/back.svg";
import ProjectCard from "../../components/projectCard";
import { recruitsApi } from "../../api/recruits";

export default function MyAppliedProject() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const {
    data: appliedRecruits,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myAppliedProjectsPage"],
    queryFn: () => recruitsApi.getAppliedRecruits({ page: 0, size: 20 }),
  });

  const cancelApplicationMutation = useMutation({
    mutationFn: (recruitId: number) =>
      recruitsApi.cancelRecruitApplication(recruitId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myAppliedProjectsPage"],
      });

      queryClient.invalidateQueries({
        queryKey: ["appliedRecruits"],
      });

      alert("지원이 취소되었습니다.");
      setSelectedProjectId(null);
    },

    onError: (error) => {
      console.error("지원 취소 실패:", error);
      alert("지원 취소에 실패했습니다.");
    },
  });

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
    if (type === "ACADEMIC") return "수업";
    return type || "모집";
  };

  const getDescription = (applicationStatus?: string) => {
    if (applicationStatus === "APPLIED") {
      return "지원이 완료된 모집글입니다.";
    }

    if (applicationStatus === "ACCEPTED") {
      return "합격 처리된 모집글입니다.";
    }

    if (applicationStatus === "REJECTED") {
      return "불합격 처리된 모집글입니다.";
    }

    if (applicationStatus === "CANCELED") {
      return "지원이 취소된 모집글입니다.";
    }

    return "내가 지원한 모집글입니다.";
  };

  const getButtonLabel = (applicationStatus?: string) => {
    if (applicationStatus === "ACCEPTED") return "승인됨";
    if (applicationStatus === "REJECTED") return "거절됨";
    if (applicationStatus === "CANCELED") return "취소됨";
    return "지원취소";
  };

  const canCancel = (applicationStatus?: string) => {
    return applicationStatus === "APPLIED" || !applicationStatus;
  };

  const handleOpenCancelModal = (projectId: number, applicationStatus?: string) => {
    if (!canCancel(applicationStatus)) {
      alert("이미 처리된 지원은 취소할 수 없습니다.");
      return;
    }

    setSelectedProjectId(projectId);
  };

  const handleCloseCancelModal = () => {
    if (cancelApplicationMutation.isPending) return;
    setSelectedProjectId(null);
  };

  const handleConfirmCancel = () => {
    if (selectedProjectId === null) return;

    cancelApplicationMutation.mutate(selectedProjectId);
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
                내가 지원한 프로젝트
              </span>
            </div>

            <div className="h-[24px] w-[24px]" />
          </div>
        </header>

        <section className="px-[16px] pt-[16px]">
          {isLoading && (
            <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
              지원한 프로젝트를 불러오는 중입니다.
            </div>
          )}

          {isError && !isLoading && (
            <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#EF4444] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
              지원한 프로젝트를 불러오지 못했습니다.
            </div>
          )}

          {!isLoading && !isError && !appliedRecruits?.recruits?.length && (
            <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[18px] text-center text-[14px] font-medium leading-[20px] text-[#64748B] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
              지원한 프로젝트가 없습니다.
            </div>
          )}

          {!isLoading && !isError && appliedRecruits?.recruits?.length ? (
            <div className="flex flex-col gap-[12px]">
              {appliedRecruits.recruits.map((project: any) => (
                <ProjectCard
                  key={project.recruitId}
                  category={getCategoryText(project.type)}
                  dDay={calculateDday(project.deadline)}
                  title={project.title}
                  description={getDescription(project.applicationStatus)}
                  recruitCount={project.totalHeadcount ?? 0}
                  techStacks={project.skills ?? []}
                  writer="작성자"
                  department=""
                  buttonLabel={getButtonLabel(project.applicationStatus)}
                  onButtonClick={() =>
                    handleOpenCancelModal(
                      project.recruitId,
                      project.applicationStatus,
                    )
                  }
                />
              ))}
            </div>
          ) : null}
        </section>
      </main>

      {selectedProjectId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-[24px]">
          <div className="w-full max-w-[320px] rounded-[16px] bg-white px-[20px] py-[24px] shadow-lg">
            <p className="text-center text-[16px] font-semibold leading-[24px] text-[#111827]">
              지원을 취소하시겠습니까?
            </p>

            <div className="mt-[20px] flex gap-[10px]">
              <button
                type="button"
                onClick={handleCloseCancelModal}
                disabled={cancelApplicationMutation.isPending}
                className="flex-1 rounded-[10px] border border-[#D1D5DB] bg-white py-[12px] text-[14px] font-medium text-[#374151] disabled:opacity-50"
              >
                아니오
              </button>

              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelApplicationMutation.isPending}
                className="flex-1 rounded-[10px] bg-[#2F6BFF] py-[12px] text-[14px] font-semibold text-white disabled:opacity-50"
              >
                {cancelApplicationMutation.isPending ? "취소 중..." : "예"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}