import { useParams, useNavigate } from "react-router-dom";
import backIcon from "../../assets/back.svg";
import { recruitsApi } from "../../api/recruits";
import ProjectCard from "../../components/projectCard";
import { useEffect, useRef, useState } from "react";
import type { ApplyRequest, RecruitSummary } from "../../types";
import { useRecruitActions } from "../../hooks/useRecruitHandler";
import BottomSheet from "../../components/bottomSheet";
import ApplyForm from "../../components/applyForm";

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const recruitId = Number(id);

  const [data, setData] = useState<RecruitSummary | null>(null);

  const [sheetWidth, setSheetWidth] = useState<number>(430);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await recruitsApi.getRecruitDetail(recruitId);
        setData(data.recruits);
      } catch (error) {
        console.log("프로젝트 불러오기 실패", error);
      }
    })();
  }, [recruitId]);

  useEffect(() => {
    const updateSheetWidth = () => {
      if (wrapperRef.current) {
        setSheetWidth(wrapperRef.current.offsetWidth);
      }
    };

    updateSheetWidth();
    window.addEventListener("resize", updateSheetWidth);

    return () => {
      window.removeEventListener("resize", updateSheetWidth);
    };
  }, []);

  useEffect(() => {
    const isOpen = isSheetOpen;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSheetOpen]);

  const handleOpenSheet = (id?: number) => {
    if (wrapperRef.current) {
      setSheetWidth(wrapperRef.current.offsetWidth);
    }
    if (id) {
      setIsSheetOpen(true);
    }
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  const { handleApply, handleBookmark } = useRecruitActions();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const finalData: ApplyRequest = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      introduction: formData.get("introduction") as string,
      requiredSkills: formData.get("requiredSkills") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      contactEmail: formData.get("contactEmail") as string,
      githubUrl: formData.get("githubUrl") as string,
    };
    await handleApply(recruitId, finalData, () => {
      handleCloseSheet();
      alert("성공적으로 프로젝트에 지원되었습니다!");
    });
  };

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
        {!data ? (
          <>로딩중...</>
        ) : (
          <ProjectCard
            key={data.recruitId}
            category={data.category}
            dDay={data.deadline}
            title={data.title}
            description={data.content}
            recruitCount={data.totalHeadcount}
            techStacks={data.skills}
            writer={data.author.nickname}
            department={data.department}
            buttonLabel="지원하기"
            onButtonClick={() => handleOpenSheet(data.recruitId)}
            selectedProject={data}
            isBookmarked={data.bookmarkedByMe}
            onBookmarkClick={() =>
              handleBookmark(data.recruitId, data.bookmarkedByMe)
            }
          />
        )}
      </div>

      {/* 지원하기 바텀시트 */}
      <BottomSheet
        open={isSheetOpen}
        title="지원하기"
        sheetWidth={sheetWidth}
        onClose={() => handleCloseSheet()}
      >
        <ApplyForm
          onSubmit={(e) => handleSubmit(e)}
          onCancel={() => handleCloseSheet()}
        />
      </BottomSheet>
    </main>
  );
};

export default ProjectDetailPage;
