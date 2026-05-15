import { useState, useEffect } from "react"; // ✅ useEffect 추가
import FieldLabel from "../components/fieldLabel";
import { useNavigate } from "react-router-dom";
import { PATH } from "../components/path";
import Input from "../components/input";
import Textarea from "../components/textarea";
import { membersApi } from "../api/member";

const SignUpPage = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // ✅ [보호 로직] 이미 가입한 유저인지 체크
  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const profile = await membersApi.getMyProfile();
        // 닉네임이 있다면 이미 등록된 유저이므로 홈으로 강제 이동
        if (profile && profile.nickname) {
          console.log("이미 등록된 사용자입니다. 홈으로 이동합니다.");
          navigate(PATH.HOME, { replace: true });
        }
      } catch (error) {
        // 에러가 발생하면(404 등) 신규 유저이므로 그대로 가입 페이지 유지
        console.log("신규 유저 확인: 가입 절차를 진행합니다.");
      }
    };

    checkExistingUser();
  }, [navigate]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() !== "") {
      e.preventDefault();
      setTags([...tags, input.trim()]);
      setInput("");
    }
  };

  const handleDelete = (deleteTag: string) => {
    setTags((prev) => prev.filter((tag) => tag !== deleteTag));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const finalData = {
      nickname: data.nickname,
      role: data.role,
      email: data.email,
      githubUrl: data.githubUrl,
      content: data.intro,
      tags: tags,
    };

    try {
      await membersApi.signUp(finalData);
      alert("계정 생성이 완료되었습니다! 환영합니다.");
      navigate(PATH.HOME, { replace: true }); // ✅ replace를 써서 뒤로가기 방지
    } catch (error) {
      console.error("가입 실패:", error);
      alert("정보 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-[400px] bg-[#F7F8FA] pb-[100px] relative shadow-inner">
      <div className="px-5 py-10 flex flex-col gap-8 text-left">
        <div className="flex flex-col gap-2">
          <p className="font-bold text-[24px] text-[#111827]">계정 생성</p>
          <p className="text-[14px] text-[#64748B]">프로필 정보를 입력해주세요</p>
        </div>

        <form id="signUpForm" onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* 이름 */}
          <div className="flex flex-col gap-2">
            <FieldLabel label="이름" required={true} />
            <Input name="nickname" placeholder="이름을 입력하세요" />
          </div>

          {/* 직무 */}
          <div className="flex flex-col gap-2">
            <FieldLabel label="직무" required={true} />
            <Input name="role" placeholder="예: 프론트엔드 개발자" />
          </div>

          {/* 이메일 */}
          <div className="flex flex-col gap-2">
            <FieldLabel label="이메일" required={true} />
            <Input name="email" placeholder="example@email.com" />
          </div>

          {/* 깃허브 */}
          <div className="flex flex-col gap-2">
            <FieldLabel label="깃허브 주소" required={false} />
            <Input name="githubUrl" placeholder="https://github.com/username" />
          </div>

          {/* 자기소개 */}
          <div className="flex flex-col gap-2">
            <FieldLabel label="자기소개" required={true} />
            <Textarea name="intro" placeholder="자기소개를 입력하세요" />
          </div>

          {/* 기술 스택 */}
          <div className="flex flex-col gap-2">
            <FieldLabel label="사용 가능한 툴 / 기술 스택" required={true} />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="하나씩 입력하고 Enter를 누르세요"
              onKeyDown={handleAddTag}
            />
            <div className="flex gap-2 flex-wrap mt-1">
              {tags.map((tag) => (
                <span key={tag} className="text-[#0069A8] bg-[#F0F9FF] px-3 py-1 rounded-full text-[12px] font-medium border border-[#B3E0FF] flex items-center">
                  {tag}
                  <button type="button" className="ml-2 cursor-pointer font-bold" onClick={() => handleDelete(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* 고정 하단 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] p-5 bg-white border-t border-gray-100 z-50">
        <button
          type="submit"
          form="signUpForm"
          className="bg-[#2F6BFF] w-full h-14 rounded-[14px] text-white font-bold text-[16px] active:scale-[0.98] transition-all shadow-md shadow-blue-100"
        >
          계정 생성 완료
        </button>
      </div>
    </main>
  );
};

export default SignUpPage;