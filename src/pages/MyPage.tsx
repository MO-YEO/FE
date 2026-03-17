import { useNavigate } from "react-router-dom";
import PostPreviewCard from "../components/PostPreviewCard";
import backIcon from "../assets/back.svg";
import editIcon from "../assets/edit.svg";
import mailIcon from "../assets/mail.svg";
import projectIcon from "../assets/project.svg";
import postIcon from "../assets/post.svg";
import logoutIcon from "../assets/logout.svg";
import profileImage from "../assets/profileImage.svg";

export default function MyPage() {
  const navigate = useNavigate();

  const profile = {
    name: "김가톨릭",
    role: "Frontend Developer",
    email: "name@catholic.ac.kr",
    bio: "안녕하세요! 프론트엔드 개발에 관심있는 학생입니다.",
    techStacks: ["React", "TypeScript", "Node.js"],
    githubUrl: "github.com/user",
  };

  const stats = [
    { label: "참여\n프로젝트", value: 12 },
    { label: "스크랩", value: 45 },
    { label: "좋아요", value: 156 },
  ];

  const projects = [
    {
      id: 1,
      title: "2026 ICT 공모전 팀원 모집",
      role: "Frontend",
      status: "모집중",
      applicants: "4/5 지원자 확인하기",
    },
    {
      id: 2,
      title: "2026 정처기 한방에 끝내자 스터디원 모집",
      role: "스터디원",
      status: "모집중",
      applicants: "4/5",
    },
  ];

  const posts = [
    {
      id: 1,
      title: "도서관gogo",
      likeCount: 1,
      commentCount: 2,
      date: "02.10 14:31",
    },
    {
      id: 2,
      title: "도서관gogo",
      likeCount: 1,
      commentCount: 0,
      date: "02.10 14:31",
    },
    {
      id: 3,
      title: "도서관gogo",
      likeCount: 0,
      commentCount: 2,
      date: "02.10 14:31",
    },
  ];

  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] bg-[#F8FAFC] pb-[88px]">
      {/* 헤더 */}
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="flex h-[96px] items-end px-[16px] pb-[20px] pt-[40px]">
          <button type="button">
            <img src={backIcon} alt="뒤로가기" className="h-[24px] w-[24px]" />
          </button>

          <div className="flex flex-1 justify-center">
            <span className="text-[20px] font-bold leading-[28px] text-[#000000]">
              마이페이지
            </span>
          </div>

          <div className="h-[36px] w-[36px] shrink-0" />
        </div>
      </header>

      <section className="px-[16px] pt-[16px]">
        <div className="flex flex-col gap-[16px]">
          {/* 프로필 카드 */}
          <section className="rounded-[14px] border border-[#E2E8F0] bg-white px-[20px] pb-[20px] pt-[20px] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            <div className="flex items-start justify-between gap-[12px]">
              <div className="flex min-w-0 flex-1 items-start gap-[14px]">
                <div className="h-[80px] w-[80px] shrink-0 overflow-hidden rounded-full">
                  <img
                    src={profileImage}
                    alt="프로필 이미지"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 pt-[4px]">
                  <div className="text-[18px] font-bold leading-[26px] text-[#111827]">
                    {profile.name}
                  </div>

                  <div className="mt-[6px] whitespace-pre-line text-[14px] leading-[20px] text-[#475569]">
                    {profile.role}
                  </div>

                  <div className="mt-[8px] flex items-center gap-[8px] text-[12px] leading-[18px] text-[#94A3B8]">
                    <img src={mailIcon} alt="" className="h-[18px] w-[18px]" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="mt-[6px] flex shrink-0 items-center gap-[6px] text-[12px] font-medium leading-[20px] text-[#2563EB]"
              >
                <span>수정하기</span>
                <img src={editIcon} alt="" className="h-[18px] w-[18px]" />
              </button>
            </div>

            <p className="mt-[20px] text-[14px] leading-[20px] text-[#45556C]">
              {profile.bio}
            </p>

            <div className="mt-[16px] flex flex-wrap gap-[10px]">
              {profile.techStacks.map((stack) => (
                <span
                  key={stack}
                  className="rounded-[8px] bg-[#EFF6FF] px-[8px] py-[4px] text-[12px] font-medium leading-[16px] text-[#1447E6]"
                >
                  {stack}
                </span>
              ))}
            </div>
          </section>

          {/* 활동 요약 */}
          <section className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[18px] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            <div className="grid grid-cols-3">
              {stats.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex min-h-[96px] flex-col items-center justify-center ${
                    index !== stats.length - 1 ? "border-r border-[#E2E8F0]" : ""
                  }`}
                >
                  <span className="h-[28px] text-[22px] font-bold leading-[28px] text-[#3B82F6]">
                    {item.value}
                  </span>

                  <span className="mt-[12px] h-[32px] whitespace-pre-line text-center text-[12px] leading-[16px] text-[#62748E]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 내 프로젝트 */}
          <section>
            <div className="mb-[12px] flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <img src={projectIcon} alt="" className="h-[22px] w-[22px]" />
                <h2 className="text-[16px] font-bold leading-[24px] text-[#111827]">
                  내 프로젝트
                </h2>
              </div>

              <button
                type="button"
                className="text-[12px] font-semibold leading-[20px] text-[#0EA5E9]"
              >
                전체보기
              </button>
            </div>

            <div className="flex flex-col gap-[12px]">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[14px] shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex items-start justify-between gap-[12px]">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[15px] font-bold leading-[24px] text-[#1E293B]">
                        {project.title}
                      </h3>
                    </div>

                    <span className="shrink-0 rounded-[14px] bg-[#1D9BF0] px-[14px] py-[6px] text-[12px] font-bold leading-[20px] text-white shadow-[0_2px_6px_rgba(29,155,240,0.25)]">
                      {project.status}
                    </span>
                  </div>

                  <div className="mt-[14px] flex items-end justify-between gap-[12px]">
                    <div className="text-[12px] leading-[20px] text-[#62748E]">
                      역할: {project.role}
                    </div>

                    <div className="text-right text-[12px] font-semibold leading-[20px] text-[#2563EB]">
                      {project.applicants}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 내가 작성한 게시물 */}
          <section>
            <div className="mb-[12px] flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <img src={postIcon} alt="" className="h-[22px] w-[22px]" />
                <h2 className="text-[16px] font-bold leading-[24px] text-[#111827]">
                  내가 작성한 게시물
                </h2>
              </div>

              <button
                type="button"
                onClick={() => navigate("/mypage/posts")}
                className="text-[12px] font-semibold leading-[20px] text-[#0EA5E9]"
              >
                전체보기
              </button>
            </div>

            <div className="flex flex-col gap-[12px]">
              {posts.map((post) => (
                <PostPreviewCard
                  key={post.id}
                  title={post.title}
                  likeCount={post.likeCount}
                  commentCount={post.commentCount}
                  date={post.date}
                />
              ))}
            </div>
          </section>

          {/* 로그아웃 */}
          <button
            type="button"
            className="mt-[4px] flex h-[52px] w-full items-center gap-[10px] rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] text-left shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
          >
            <img src={logoutIcon} alt="" className="h-[18px] w-[18px]" />
            <span className="text-[14px] font-medium leading-[20px] text-[#F97316]">
              로그아웃
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}