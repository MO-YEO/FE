import { useState } from "react";
import { ACTIVITY_CATEGORY, RECRUIT_CATEGORY } from "../constants/category";
import FieldLabel from "./fieldLabel";
import Input from "./input";
import Textarea from "./textarea";

type Project = {
  title?: string;
  content?: string;
  applicantCount?: number;
  totalHeadcount?: number;
  skills?: string;
  deadline?: string;
  department?: string;
  activityCategory?: string;
  recruitCategory?: string;
};

type RegisterFormProps = {
  project?: Project | null;
  submitText?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export default function RegisterForm({
  project,
  submitText = "등록하기",
  onSubmit,
  onCancel,
}: RegisterFormProps) {
  const [selectMenu, setSelectMenu] = useState<string>(
    project?.activityCategory ?? ACTIVITY_CATEGORY[0].value,
  );

  const [selectTagMenu, setSelectTagMenu] = useState<string>(
    project?.recruitCategory ?? RECRUIT_CATEGORY[0].value,
  );

  return (
    <form onSubmit={onSubmit} className="flex max-h-[80vh] flex-col bg-white">
      <div className="flex flex-1 flex-col gap-[10px] overflow-y-auto px-5 py-6">
        <FieldLabel label="프로젝트 제목" required />
        <Input
          name="title"
          defaultValue={project?.title ?? ""}
          placeholder="예: 2026 공모전 팀원 모집"
        />

        <FieldLabel label="카테고리" />
        <div className="shrink-0 overflow-x-auto px-4 py-2 border rounded-lg border-[#E5E7EB]">
          <div className="flex gap-2">
            {ACTIVITY_CATEGORY.map((tag) => (
              <button
                key={tag.value}
                type="button"
                className={`shrink-0 cursor-pointer rounded-xl border px-3 py-[6px] text-[12px] font-bold ${
                  tag.value === selectMenu
                    ? "border-[#356AE6] bg-[#356AE6] text-white"
                    : "border-[#E5E7EB] bg-white text-[#111827]"
                }`}
                onClick={() => setSelectMenu(tag.value)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <FieldLabel label="세부 카테고리" />
        <div className="shrink-0 overflow-x-auto px-4 py-2 border rounded-lg border-[#E5E7EB]">
          <div className="flex gap-2">
            {RECRUIT_CATEGORY.map((tag) => (
              <button
                key={tag.value}
                type="button"
                className={`shrink-0 cursor-pointer rounded-xl border px-3 py-[6px] text-[12px] font-bold ${
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
        </div>

        <input type="hidden" name="activityCategory" value={selectMenu} />
        <input type="hidden" name="recruitCategory" value={selectTagMenu} />
        <input type="hidden" name="type" value={selectMenu} />
        <input type="hidden" name="category" value={selectTagMenu} />

        <FieldLabel label="프로젝트 설명" required />
        <Textarea
          name="content"
          defaultValue={project?.content ?? ""}
          placeholder="프로젝트에 대해 설명해주세요"
        />

        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-[10px]">
            <FieldLabel label="현재 인원" required />
            <Input
              name="applicantCount"
              placeholder="예: 4"
              type="number"
              defaultValue={project?.applicantCount ?? ""}
            />
          </div>

          <div className="flex flex-1 flex-col gap-[10px]">
            <FieldLabel label="모집 인원" required />
            <Input
              name="totalHeadcount"
              placeholder="예: 4"
              type="number"
              defaultValue={project?.totalHeadcount ?? ""}
            />
          </div>
        </div>

        <FieldLabel label="필요한 툴 / 기술 스택" required={false} />
        <Input
          name="skills"
          placeholder="예: React, 포토샵, 노션 (쉼표로 구분해주세요!)"
          defaultValue={project?.skills ?? ""}
        />

        <FieldLabel label="모집 마감일" required />
        <Input
          name="deadline"
          placeholder="예: 2026-12-12"
          defaultValue={project?.deadline ?? ""}
        />

        <FieldLabel label="나의 정보" required={false} />
        <Input
          name="department"
          placeholder="예: 미디어기술콘텐츠학과"
          defaultValue={project?.department ?? ""}
        />
      </div>

      <div className="flex gap-3 border-t border-[#E5E7EB] p-5">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-[#D1D5DB] py-3 font-medium"
        >
          취소
        </button>

        <button
          type="submit"
          className="flex-1 rounded-lg bg-[#2563EB] py-3 font-medium text-white"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}
