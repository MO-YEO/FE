import { useState } from "react";

const SignUpPage = () => {
  const fields = [
    {
      id: "nikename",
      title: "이름",
      placeholder: "이름을 입력하세요",
      required: true,
    },
    {
      id: "role",
      title: "직무",
      placeholder: "예: 프론트엔드 개발자",
      required: true,
    },
    {
      id: "email",
      title: "이메일",
      placeholder: "example@email.com",
      required: true,
    },
    {
      id: "githubUrl",
      title: "깃허브 주소",
      placeholder: "https://github.com/username",
      required: false,
    },
    {
      id: "intro",
      title: "자기소개",
      placeholder: "자기소개를 입력하세요",
      required: true,
    },
  ];
  const [tags, setTags] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() !== "") {
      e.preventDefault();

      setTags([...tags, input.trim()]);
      setInput("");
    }
  };
  const handleDelete = (deleteIdx: number) => {
    setTags((prev) => prev.filter((_, idx) => idx !== deleteIdx));
  };
  return (
    <div className="bg-[#F7F8FA] px-5 py-10 flex flex-col gap-5 h-full">
      <div className="flex flex-col gap-2">
        <p className="font-bold text-[24px]">계정 생성</p>
        <p className="font-regular text-[14px]">프로필 정보를 입력해주세요</p>
      </div>
      <form className="flex flex-col gap-2">
        {fields.map((field) => (
          <>
            <p className="font-bold">
              {field.title}
              {field.required && (
                <span className="text-[#2F6BFF] font-bold"> *</span>
              )}
            </p>
            {field.id === "intro" ? (
              <textarea
                name={`${field.id}`}
                className="bg-white px-4 py-[14px] h-27 rounded-lg border border-[#E2E8F0] focus:outline-none text-[14px] resize-none"
                placeholder={`${field.placeholder}`}
              />
            ) : (
              <input
                name={`${field.id}`}
                className="bg-white px-4 py-[14px] rounded-lg border border-[#E2E8F0] focus:outline-none text-[14px]"
                placeholder={`${field.placeholder}`}
              />
            )}
          </>
        ))}
        <p className="font-bold">
          사용 가능한 툴 / 기술 스택
          <span className="text-[#2F6BFF] font-bold"> *</span>
        </p>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-white px-4 py-[14px] rounded-lg border border-[#E2E8F0] focus:outline-none text-[14px]"
          placeholder="하나씩 입력하고 Enter를 누르세요"
          onKeyDown={handleAddTag}
        />
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag, idx) => (
            <p
              key={idx}
              className="text-[#0069A8] bg-[#F0F9FF] px-2 py-1 rounded-lg"
            >
              {tag}
              <button
                type="button"
                className="px-1 cursor-pointer"
                onClick={() => handleDelete(idx)}
              >
                x
              </button>
            </p>
          ))}
        </div>
        <button
          type="submit"
          className="bg-[#2F6BFF] h-13 rounded-lg text-white font-bold cursor-pointer"
        >
          계정 생성 완료
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
