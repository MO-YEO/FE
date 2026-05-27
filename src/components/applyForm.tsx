import FieldLabel from "./fieldLabel";
import Input from "./input";
import Textarea from "./textarea";

const fields = [
  { id: "name", title: "이름", placeholder: "김가톨릭", required: true },
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
    placeholder: "예: React, 포토샵, 노션",
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

type ApplyFormProps = {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
};

export default function ApplyForm({ onSubmit, onCancel }: ApplyFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex max-h-[calc(100vh-96px)] flex-col overflow-y-auto bg-white"
    >
      <div className="flex flex-col gap-[10px] overflow-y-auto px-4 py-4">
        {fields.map((field) => (
          <div key={field.id} className="flex w-full flex-col gap-2">
            <FieldLabel label={field.title} required={field.required} />

            {field.id === "introduction" ? (
              <Textarea
                name={field.id}
                required={field.required}
                className="h-28 w-full resize-none rounded-lg border border-[#E2E8F0] bg-white px-4 py-[14px] text-[14px] focus:border-[#356AE6] focus:outline-none"
                placeholder={field.placeholder}
              />
            ) : (
              <Input
                name={field.id}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-[#E2E8F0] bg-white px-5 py-5">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
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
  );
}
