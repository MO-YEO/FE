import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import backIcon from "../../assets/back.svg";
import { recruitsApi } from "../../api/recruits";
import { membersApi } from "../../api/member";
import ProjectCard from "../../components/projectCard";

const ProjectDetailPage = () => {
  // const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const queryClient = useQueryClient();

  // const recruitId = Number(id);
  // console.log(recruitId);

  // // 현재 사용자 확인용
  // const { data: profile } = useQuery({
  //   queryKey: ["myProfile"],
  //   queryFn: membersApi.getMyProfile,
  // });

  // const { data: detail, isLoading } = useQuery({
  //   queryKey: ["recruits", recruitId],
  //   queryFn: () => recruitsApi.getRecruitDetail(recruitId),
  //   enabled: !!recruitId,
  // });

  // const applyMutation = useMutation({
  //   mutationFn: () => recruitsApi.apply(recruitId),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["recruits", recruitId] });
  //     alert("팀 지원이 완료되었습니다!");
  //   },
  //   onError: () => {
  //     alert("지원 처리에 실패했습니다. (마감되었거나 잘못된 요청)");
  //   },
  // });

  // if (isLoading) {
  //   return (
  //     <div className="flex flex-col min-h-screen bg-[#F9FAFB] max-w-[430px] mx-auto w-full justify-center items-center">
  //       <p className="text-center text-[#64748B] py-10 font-medium animate-pulse">
  //         프로세스 불러오는 중...
  //       </p>
  //     </div>
  //   );
  // }

  // if (!detail) {
  //   return (
  //     <div className="flex flex-col min-h-screen bg-[#F9FAFB] max-w-[430px] mx-auto w-full items-center justify-center">
  //       <p className="text-[#64748B] text-[15px] font-medium">
  //         프로젝트를 찾을 수 없습니다.
  //       </p>
  //       <button
  //         onClick={() => navigate(-1)}
  //         className="mt-4 text-[#5C7CFF] font-bold"
  //       >
  //         뒤로 돌아가기
  //       </button>
  //     </div>
  //   );
  // }

  // const isAuthor = profile?.memberId === detail.author.memberId;
  // const isClosed = detail.status === "CLOSED";

  // D-Day
  // let dDayStr = "";
  // if (detail.deadline) {
  //   const diffTime = new Date(detail.deadline).getTime() - new Date().getTime();
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   if (diffDays > 0) dDayStr = `D-${diffDays}`;
  //   else if (diffDays === 0) dDayStr = "D-Day";
  //   else dDayStr = "기간 마감";
  // }
  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] bg-[#F8FAFC] pb-[88px] font-sans relative">
      <header className="border-b border-[#E5E7EB] bg-white sticky top-0 z-30">
        <div className="flex h-[96px] items-end px-[16px] pb-[20px] pt-[40px]">
          <button type="button" onClick={() => navigate(-1)}>
            <img
              src={backIcon}
              alt="뒤로가기"
              className="h-[24px] w-[24px] cursor-pointer"
            />
          </button>
          <div className="flex flex-1 justify-center">
            <span className="text-[20px] font-bold leading-[28px] text-[#000000]">
              프로젝트
            </span>
          </div>
          <div className="size-6"></div>
        </div>
      </header>
      <div className="flex-1 bg-[#F9FAFB] px-5 py-4 pb-20">
        <ProjectCard
          category="기획"
          dDay="2024-03-04"
          title="목데이터 테스트"
          description="api 완성되면 바꿀 예정"
          recruitCount={3}
          techStacks={["굿"]}
          writer="나"
          department="소속"
          buttonLabel="지원하기"
        />
      </div>
    </main>
  );
};

export default ProjectDetailPage;
