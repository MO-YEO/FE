import { useEffect, useRef, useState } from "react";
import bookmarkIcon from "../assets/bookmark.svg";
import { recruitsApi } from "../api/recruits";
import RegisterForm from "./registerForm";
import BottomSheet from "./bottomSheet";
import { RECRUIT_CATEGORY } from "../constants/category";

type ProjectCardProps = {
  category: string;
  dDay: string;
  title: string;
  description: string;
  recruitCount: number;
  techStacks: string[];
  writer: string;
  department: string;
  buttonLabel: string;
  onButtonClick?: () => void;
  author?: boolean;
  recruitId?: number;
  selectedProject?: null | any;
};

export default function ProjectCard({
  category,
  dDay,
  title,
  description,
  recruitCount,
  techStacks,
  writer,
  department,
  buttonLabel,
  onButtonClick,
  author,
  selectedProject,
}: ProjectCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleOpenSheet = () => {
    if (wrapperRef.current) {
      setSheetWidth(wrapperRef.current.offsetWidth);
    }

    setIsEditOpen(true);
  };

  const handleCloseSheet = () => {
    setIsEditOpen(false);
  };
  const categoryLabel =
    RECRUIT_CATEGORY.find((item) => item.value === category)?.label || category;

  const [sheetWidth, setSheetWidth] = useState<number>(430);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleDeleteProject = async () => {
    try {
      if (!window.confirm("삭제하시겠습니까?")) return;
      await recruitsApi.deleteRecruit(selectedProject.recruitId);
      window.location.reload();
    } catch (err) {
      console.log("프로젝트 삭제 실패", err);
    }
  };

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
    const isOpen = isEditOpen;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEditOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const finalData = {
      ...data,
      skills:
        (formData.get("skills") as string)
          ?.split(",")
          .map((skill) => skill.trim())
          .filter(Boolean) || [],
    };
    console.log("최종 데이터:", finalData);
    try {
      console.log(selectedProject.recruitId);
      await recruitsApi.patchRecruit(selectedProject.recruitId, finalData);
      handleCloseSheet();
      window.location.reload();
    } catch (error) {
      console.log("프로젝트 수정 실패", error);
    }
  };

  return (
    <div className="bg-white flex flex-col gap-3 p-4 rounded-[14px] shadow-sm border border-[#D0D0D0]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <button className="text-[10px] text-[#2F6BFF] font-bold bg-[#EFF6FF] px-2 py-1 rounded-lg">
            {categoryLabel}
          </button>

          <button className="text-[10px] text-[#EF4400] font-bold bg-[#FEF2F2] px-2 py-1 rounded-lg">
            {dDay}
          </button>
        </div>
        <div className="flex gap-2">
          {author && (
            <div className="flex gap-2">
              <button
                className="text-[12px] cursor-pointer"
                onClick={handleOpenSheet}
              >
                수정
              </button>
              <button
                className="text-[12px] cursor-pointer"
                onClick={handleDeleteProject}
              >
                삭제
              </button>
            </div>
          )}
          <button type="button" className="shrink-0">
            <img
              src={bookmarkIcon}
              alt="스크랩"
              className="h-[15px] w-[15px]"
            />
          </button>
        </div>
      </div>

      <p className="font-bold text-[16px] text-[#111827] leading-[24px]">
        {title}
      </p>

      <p className="text-[14px] text-[#374151] leading-[22px]">{description}</p>

      <div>
        <p className="text-[12px] text-[#4B5563]">모집인원: {recruitCount}명</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {techStacks.map((stack) => (
          <button
            key={stack}
            className="text-[10px] text-[#0069A8] bg-[#F0F9FF] px-2 py-1 rounded-lg"
          >
            {stack}
          </button>
        ))}
      </div>

      <div className="border-t border-[#D0D0D0] flex justify-between items-center pt-3">
        <div className="text-[#9D9D9D] text-[12px] leading-[18px]">
          <p>{writer}</p>
          <p>{department}</p>
        </div>

        <button
          className="bg-[#2F6BFF] rounded-lg px-4 py-2 text-[12px] text-white font-bold leading-none shadow-sm cursor-pointer"
          onClick={onButtonClick}
        >
          {buttonLabel}
        </button>
      </div>

      {/*수정하기 폼*/}
      <BottomSheet
        open={isEditOpen}
        title="프로젝트 수정"
        sheetWidth={sheetWidth}
        onClose={handleCloseSheet}
      >
        <RegisterForm
          project={selectedProject}
          submitText="수정하기"
          onSubmit={handleSubmit}
          onCancel={handleCloseSheet}
        />
      </BottomSheet>
    </div>
  );
}
