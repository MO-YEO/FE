import { useEffect, useState } from "react";
import bookmarkIcon from "../assets/bookmark.svg";
import bookmarkActiveIcon from "../assets/bookmark.svg";
import RegisterForm from "./registerForm";
import BottomSheet from "./bottomSheet";
import { RECRUIT_CATEGORY } from "../constants/category";
import { useDeleteRecruits } from "../hooks/mutations/useDeleteRecruits";
import { usePatchRecruits } from "../hooks/mutations/usePatchRecruits";
import type { PatchRecruitParams } from "../types";

type ProjectCardProps = {
  category: string;
  dDay: string;
  title: string;
  description: string;
  recruitCount: number;
  techStacks: string[];
  writer: string;
  applicationStatus?: string;
  department: string;
  buttonLabel: string;
  onButtonClick?: () => void;
  currentCount?: number;
  totalCount?: number;
  author?: boolean;
  recruitId?: number;
  selectedProject?: any;
  isBookmarked?: boolean;
  onBookmarkClick?: (e: React.MouseEvent) => void;
  onCardClick?: () => void;
};

export default function ProjectCard({
  category,
  dDay,
  title,
  description,
  recruitCount,
  techStacks,
  writer,
  applicationStatus,
  department,
  buttonLabel,
  onButtonClick,
  currentCount,
  totalCount,
  author = false,
  selectedProject,
  isBookmarked,
  onBookmarkClick,
  onCardClick,
}: ProjectCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const categoryLabel =
    RECRUIT_CATEGORY.find((item) => item.value === category)?.label || category;

  const recruitCountText =
    typeof currentCount === "number" && typeof totalCount === "number"
      ? `${currentCount}/${totalCount}`
      : `${recruitCount}명`;

  const getApplicationStatusLabel = (status?: string) => {
    if (status === "APPLIED") return "지원 완료";
    if (status === "ACCEPTED") return "승인 완료";
    if (status === "REJECTED") return "거절";
    if (status === "CANCELED") return "지원 취소";
    return status;
  };

  const getApplicationStatusClassName = (status?: string) => {
    if (status === "ACCEPTED") {
      return "bg-[#EFF6FF] text-[#2563EB]";
    }

    if (status === "REJECTED") {
      return "bg-[#FEF2F2] text-[#DC2626]";
    }

    if (status === "CANCELED") {
      return "bg-[#F1F5F9] text-[#64748B]";
    }

    return "bg-[#F0FDF4] text-[#16A34A]";
  };

  const handleOpenSheet = () => {
    setIsEditOpen(true);
  };

  const handleCloseSheet = () => {
    setIsEditOpen(false);
  };

  const { mutate: deleteRecruit } = useDeleteRecruits();

  const handleDeleteProject = () => {
    if (!selectedProject?.recruitId) {
      alert("삭제할 프로젝트 정보를 찾을 수 없습니다.");
      return;
    }
    if (!window.confirm("삭제하시겠습니까?")) return;
    deleteRecruit(selectedProject.recruitId);
  };

  const { mutate: patchRecruit } = usePatchRecruits();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProject?.recruitId) {
      alert("수정할 프로젝트 정보를 찾을 수 없습니다.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const finalData: PatchRecruitParams = {
      type: String(data.type),
      category: String(data.category),
      tag: String(data.tag),
      department: String(data.department),
      title: String(data.title),
      content: String(data.content),
      totalHeadcount: Number(data.totalHeadcount),
      deadline: String(data.deadline),
      skills: String(formData.get("skills") ?? "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    patchRecruit(
      {
        recruitId: selectedProject.recruitId,
        payload: finalData,
      },
      {
        onSuccess: () => {
          handleCloseSheet();
        },
      },
    );
  };

  useEffect(() => {
    document.body.style.overflow = isEditOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isEditOpen]);

  const [sheetWidth, setSheetWidth] = useState(() =>
    Math.min(window.innerWidth, 400),
  );

  useEffect(() => {
    const handleResize = () => {
      setSheetWidth(Math.min(window.innerWidth, 400));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="flex flex-col gap-3 rounded-[14px] border border-[#D0D0D0] bg-white p-4 shadow-sm"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        onCardClick?.();
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-[#EFF6FF] px-2 py-1 text-[10px] font-bold text-[#2F6BFF]">
            {categoryLabel}
          </span>

          <span className="rounded-lg bg-[#FEF2F2] px-2 py-1 text-[10px] font-bold text-[#EF4400]">
            {dDay}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {applicationStatus ? (
            <span
              className={`rounded-[8px] px-2 py-1 text-[10px] font-bold leading-4 ${getApplicationStatusClassName(
                applicationStatus,
              )}`}
            >
              {getApplicationStatusLabel(applicationStatus)}
            </span>
          ) : null}

          {author ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-[12px] text-[#64748B] cursor-pointer"
                onClick={handleOpenSheet}
              >
                수정
              </button>

              <button
                type="button"
                className="text-[12px] text-[#EF4444] cursor-pointer"
                onClick={handleDeleteProject}
              >
                삭제
              </button>
            </div>
          ) : null}

          {!applicationStatus && !author ? (
            <button
              type="button"
              onClick={onBookmarkClick}
              className="p-1 transition-transform active:scale-90"
            >
              <img
                src={isBookmarked ? bookmarkActiveIcon : bookmarkIcon}
                alt="스크랩"
                className={`
                h-[18px]
                w-[18px]
                transition-all
                ${isBookmarked ? "opacity-100" : "opacity-40 grayscale"}
              `}
              />
            </button>
          ) : null}
        </div>
      </div>

      <p className="text-[16px] font-bold leading-[24px] text-[#111827]">
        {title}
      </p>

      <p className="text-[14px] leading-[22px] text-[#374151]">{description}</p>

      <div>
        <p className="text-[12px] text-[#4B5563]">
          모집인원: {recruitCountText}
        </p>
      </div>

      {techStacks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {techStacks.map((stack) => (
            <span
              key={stack}
              className="rounded-lg bg-[#F0F9FF] px-2 py-1 text-[10px] text-[#0069A8]"
            >
              {stack}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-[#D0D0D0] pt-3">
        <div className="text-[12px] leading-[18px] text-[#9D9D9D]">
          <p>{writer}</p>
          <p>{department}</p>
        </div>

        <button
          type="button"
          className="cursor-pointer rounded-lg bg-[#2F6BFF] px-4 py-2 text-[12px] font-bold leading-none text-white shadow-sm"
          onClick={onButtonClick}
        >
          {buttonLabel}
        </button>
      </div>

      {selectedProject ? (
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
      ) : null}
    </div>
  );
}
