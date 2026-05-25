import { useParams, useNavigate } from "react-router-dom";
import backIcon from "../../assets/back.svg";
import { recruitsApi } from "../../api/recruits";
import ProjectCard from "../../components/projectCard";
import { useEffect, useRef, useState } from "react";
import type { RecruitSummary } from "../../types";
import FieldLabel from "../../components/fieldLabel";
import Input from "../../components/input";
import closeIcon from "../../assets/close.svg";

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
  });

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const finalData = {
      ...data,
      requiredSkills: formData.get("requiredSkills") as string,
    };

    console.log("백엔드 매핑 최종 지원 데이터:", finalData);

    try {
      await recruitsApi.apply(recruitId, finalData);
      handleCloseSheet();
      alert("성공적으로 프로젝트에 지원되었습니다! 🎉");
    } catch (error) {
      console.log("프로젝트 지원 실패", error);
      alert("지원에 실패했습니다. 입력 양식을 확인해주세요.");
    }
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
          />
        )}
      </div>

      {/* 지원하기 바텀시트 */}
      <ApplySheet
        onClick={() => handleCloseSheet()}
        onSubmit={handleSubmit}
        isApplyOpen={isSheetOpen}
        sheetWidth={sheetWidth}
      />
    </main>
  );
};

export default ProjectDetailPage;

//지원하기 폼
const fields = [
  {
    id: "name",
    title: "이름",
    placeholder: "김가톨릭",
    required: true,
  },
  {
    id: "role",
    title: "역할/포지션",
    placeholder: "예: 디자이너, 팀원, 발표자",
    required: true,
  },
  {
    id: "introduction",
    title: "자기소개",
    placeholder: "자기소개를 입력하세요",
    required: true,
  },
  {
    id: "requiredSkills",
    title: "사용 가능한 툴 / 기술스택",
    placeholder: "예: React, 포토샵, 노션 (쉼표로 구분해주세요!)",
    required: true,
  },
  {
    id: "phoneNumber",
    title: "연락처",
    placeholder: "010-0000-0000",
    required: true,
  },
  {
    id: "contactEmail",
    title: "이메일",
    placeholder: "example@email.com",
    required: false,
  },
  {
    id: "githubUrl",
    title: "깃허브 주소",
    placeholder: "https://github.com/username",
    required: false,
  },
];

function ApplySheet({
  onClick,
  onSubmit,
  isApplyOpen,
  sheetWidth,
}: {
  onClick: () => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  isApplyOpen: boolean;
  sheetWidth: number;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isApplyOpen
          ? "pointer-events-auto bg-black/50"
          : "pointer-events-none bg-black/0"
      }`}
      onClick={onClick}
    >
      <div
        className={`fixed bottom-0 left-1/2 z-[60] overflow-hidden rounded-t-[20px] bg-white transition-transform duration-300 ${
          isApplyOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          width: `${sheetWidth}px`,
          transform: `translateX(-50%) translateY(${
            isApplyOpen ? "0" : "100%"
          })`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 시트 헤더 */}
        <div className="h-[68.8px] border-b border-[#E2E8F0] bg-white">
          <div className="flex h-full items-center justify-between px-5">
            <h2 className="text-[18px] font-bold leading-[32px] text-[#111827]">
              지원하기
            </h2>

            <button
              type="button"
              onClick={onClick}
              className="flex h-6 w-6 cursor-pointer items-center justify-center"
            >
              <img src={closeIcon} alt="닫기" className="h-7 w-7" />
            </button>
          </div>
        </div>

        {/* 지원하기 폼 */}
        <form
          onSubmit={onSubmit}
          className="flex max-h-[calc(100vh-96px)] flex-col overflow-y-auto bg-white"
        >
          <div className="flex flex-col gap-[10px] overflow-y-auto px-4 py-4">
            {fields.map((field) => (
              <div key={field.id} className="flex w-full flex-col gap-2">
                <FieldLabel label={field.title} required={field.required} />
                {/* 💡 조건부 렌더링 검증 조건 수정 완료: id가 introduction인 경우 텍스트에어리어 컴포넌트 맵핑 */}
                {field.id === "introduction" ? (
                  <textarea
                    name={field.id}
                    className="h-28 w-full resize-none rounded-lg border border-[#E2E8F0] bg-white px-4 py-[14px] text-[14px] focus:outline-none focus:border-[#356AE6]"
                    placeholder={field.placeholder}
                  />
                ) : (
                  <Input name={field.id} placeholder={field.placeholder} />
                )}
              </div>
            ))}
          </div>

          {/* 하단 버튼 */}
          <div className="border-t border-[#E2E8F0] bg-white px-5 py-5">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClick}
                className="h-[45px] flex-1 cursor-pointer rounded-[10px] border border-[#E2E8F0] bg-white text-[14px] font-medium text-[#314158]"
              >
                취소
              </button>

              <button
                type="submit"
                className="h-[45px] flex-1 cursor-pointer rounded-[10px] bg-gradient-to-r from-[#00A6F4] to-[#2B7FFF] text-[14px] font-semibold text-white"
              >
                지원하기
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
