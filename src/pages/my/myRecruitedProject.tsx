import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import backIcon from "../../assets/back.svg";
import ProjectCard from "../../components/projectCard";
import { recruitsApi } from "../../api/recruits";

export default function MyRecruitedProject() {
  const navigate = useNavigate();

  const {
    data: myRecruits,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myRecruitedProjectsPage"],
    queryFn: () => recruitsApi.getMyRecruits({ page: 0, size: 20 }),
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

  const getCategoryText = (project: any) => {
    return (
      project.recruitCategory ||
      project.activityCategory ||
      project.category ||
      project.type ||
      "모집"
    );
  };

  const getDescription = (project: any) => {
    if (project.department) {
      return `${project.department}에서 모집 중인 프로젝트입니다.`;
    }

    if (project.tag) {
      return project.tag;
    }

    return "내가 작성한 모집글입니다.";
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
              내가 모집한 프로젝트
            </span>
          </div>

          <div className="h-[24px] w-[24px]" />
        </div>
      </header>

      <section className="px-[16px] py-[16px]">
        {isLoading && (
          <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            모집글을 불러오는 중입니다.
          </div>
        )}

        {isError && !isLoading && (
          <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#EF4444] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            모집글을 불러오지 못했습니다.
          </div>
        )}

        {!isLoading && !isError && !myRecruits?.recruits?.length && (
          <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            내가 모집한 프로젝트가 없습니다.
          </div>
        )}

        {!isLoading && !isError && myRecruits?.recruits?.length ? (
          <div className="flex flex-col gap-[12px]">
            {myRecruits.recruits.map((project) => (
              <ProjectCard
                key={project.recruitId}
                category={getCategoryText(project)}
                dDay={calculateDday(project.deadline)}
                title={project.title}
                description={getDescription(project)}
                recruitCount={project.totalHeadcount}
                techStacks={project.skills ?? []}
                writer={project.author?.nickname ?? "나"}
                department={project.department ?? ""}
                buttonLabel="지원자 확인하기"
                onButtonClick={() =>
                  navigate(`/projects/${project.recruitId}/applicants`)
                }
              />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}