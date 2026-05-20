import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import backIcon from "../../assets/back.svg";
import plusIcon from "../../assets/plus.svg";
import closeIcon from "../../assets/close.svg";
import FieldLabel from "../../components/fieldLabel";
import Input from "../../components/input";
import ProjectCard from "../../components/projectCard";
import { recruitsApi } from "../../api/recruits";
import type { RecruitSummary } from "../../types";
import { ACTIVITY_CATEGORY, RECRUIT_CATEGORY } from "../../constants/category";
import useDebounce from "../../hooks/useDebounce";
import { meApi } from "../../api/me";
import BottomSheet from "../../components/bottomSheet";
import RegisterForm from "../../components/registerForm";

const ProjectPage = () => {
  const [selectMenu, setSelectMenu] = useState("ALL");
  const [selectTagMenu, setSelectTagMenu] = useState("ALL");

  const [sheetWidth, setSheetWidth] = useState<number>(430);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 300);

  const [selectedRecruitId, setSelectedRecruitId] = useState<number | null>(
    null,
  );

  const [data, setData] = useState<RecruitSummary[]>();

  const [myId, setMyId] = useState<number | null>(null);

  const handleOpenSheet = (type: "register" | "apply", id?: number) => {
    if (wrapperRef.current) {
      setSheetWidth(wrapperRef.current.offsetWidth);
    }

    if (type === "register") {
      setIsRegisterOpen(true);
    }
    if (type === "apply" && id) {
      setSelectedRecruitId(id);
      setIsApplyOpen(true);
    }
  };

  const handleCloseSheet = (type: "register" | "apply") => {
    if (type === "register") {
      setIsRegisterOpen(false);
    } else {
      setIsApplyOpen(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    type: "register" | "apply",
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // 프로젝트 등록하기 폼 제출
    if (type === "register") {
      const finalData = {
        ...data,
        tag: "",
        skills:
          (formData.get("skills") as string)
            ?.split(",")
            .map((skill) => skill.trim())
            .filter(Boolean) || [],
        totalHeadcount: Number(formData.get("totalHeadcount")),
        applicantCount: Number(formData.get("applicantCount")),
      };
      console.log("최종 등록 데이터:", finalData);
      try {
        await recruitsApi.createRecruit(finalData);
        handleCloseSheet("register");
        // 등록 후 최신 목록으로 갱신하기 위해 강제 상태 변경 트리거 가능
      } catch (error) {
        console.log("모집글 등록 실패", error);
      }
    }

    // 지원하기 폼 제출
    if (type === "apply") {
      const finalData = {
        ...data,
        // ✨ 스웨거 명세에 맞춰 requiredSkills를 배열이 아닌 단순 string 구조로 그대로 전송
        requiredSkills: formData.get("requiredSkills") as string,
      };

      console.log("백엔드 매핑 최종 지원 데이터:", finalData);

      if (selectedRecruitId) {
        try {
          await recruitsApi.apply(selectedRecruitId, finalData);
          handleCloseSheet("apply");
          setSelectedRecruitId(null);
          alert("성공적으로 프로젝트에 지원되었습니다! 🎉");
        } catch (error) {
          console.log("프로젝트 지원 실패", error);
          alert("지원에 실패했습니다. 입력 양식을 확인해주세요.");
        }
      }
    }
  };

  const navigate = useNavigate();

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
    const isOpen = isRegisterOpen || isApplyOpen;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isRegisterOpen, isApplyOpen]);

  //나의 아이디 조회 api
  useEffect(() => {
    (async () => {
      try {
        const data = await meApi.getMe();
        setMyId(data);
      } catch (error) {
        console.log("아이디조회실패", error);
      }
    })();
  }, []);

  //프로젝트 검색/조회 api
  useEffect(() => {
    (async () => {
      try {
        console.log(selectMenu, selectTagMenu);
        const data = await recruitsApi.getRecruits({
          activityCategory: selectMenu == "ALL" ? "" : selectMenu,
          recruitCategory: selectTagMenu == "ALL" ? "" : selectTagMenu,
          keyword: debouncedValue,
          sort: "createdAt,desc",
        });
        setData(data.recruits);
      } catch (error) {
        console.log("프로젝트 불러오기 실패", error);
      }
    })();
  }, [selectMenu, selectTagMenu, debouncedValue]);

  return (
    <div className="flex min-h-full flex-col" ref={wrapperRef}>
      {/* 헤더 */}
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="flex flex-col justify-center gap-4 px-[16px] pt-[40px] pb-[20px]">
          <div className="flex items-center">
            <button
              type="button"
              className="flex h-[24px] w-[24px] items-center justify-center cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <img
                src={backIcon}
                alt="뒤로가기"
                className="h-[24px] w-[24px]"
              />
            </button>

            <div className="flex flex-1 justify-center">
              <span className="text-[20px] font-bold leading-[28px] text-[#000000]">
                프로젝트
              </span>
            </div>

            <button type="button" onClick={() => handleOpenSheet("register")}>
              <img src={plusIcon} alt="추가" className="h-[24px] w-[24px]" />
            </button>
          </div>

          <input
            className="h-11 rounded-lg border border-[#E5E7EB] p-3 focus:outline-none"
            placeholder="프로젝트 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="flex gap-2 border-b border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2">
        {[{ label: "전체", value: "ALL" }, ...ACTIVITY_CATEGORY].map(
          (menuItem) => {
            return (
              <button
                key={menuItem.value}
                type="button"
                className={`cursor-pointer text-[14px] font-bold ${
                  menuItem.value === selectMenu
                    ? "text-[#356AE6]"
                    : "text-[#4A5565]"
                }`}
                onClick={() => setSelectMenu(menuItem.value)}
              >
                {menuItem.label}
              </button>
            );
          },
        )}
      </div>

      <div className="flex gap-2 border-b border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2">
        {[{ label: "전체", value: "ALL" }, ...RECRUIT_CATEGORY].map((tag) => (
          <button
            key={tag.value}
            type="button"
            className={`cursor-pointer rounded-xl border px-3 py-[6px] text-[12px] font-bold ${
              tag.value === selectTagMenu
                ? "border-[#356AE6] bg-[#356AE6] text-white"
                : "border-[#E5E7EB] bg-white text-[#111827]"
            }`}
            onClick={() => setSelectTagMenu(tag.value)}
          >
            {tag.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-[#F9FAFB] px-5 py-4 pb-20 ">
        {!data || data.length === 0 ? (
          <div className="flex justify-center text-gray-400 text-sm mt-8">
            아직 등록된 프로젝트가 없어요
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {data.map((data) => {
              const Author = myId === data.author.memberId;
              return (
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
                  onButtonClick={() => handleOpenSheet("apply", data.recruitId)}
                  author={Author}
                  selectedProject={data}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 프로젝트 등록 바텀시트 */}
      <BottomSheet
        open={isRegisterOpen}
        title="프로젝트 등록"
        sheetWidth={sheetWidth}
        onClose={() => handleCloseSheet("register")}
      >
        <RegisterForm
          onSubmit={(e) => handleSubmit(e, "register")}
          onCancel={() => handleCloseSheet("register")}
        />
      </BottomSheet>

      {/* 지원하기 바텀시트 */}
      <ApplySheet
        onClick={() => handleCloseSheet("apply")}
        onSubmit={(e) => handleSubmit(e, "apply")}
        isApplyOpen={isApplyOpen}
        sheetWidth={sheetWidth}
      />
    </div>
  );
};

export default ProjectPage;

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
