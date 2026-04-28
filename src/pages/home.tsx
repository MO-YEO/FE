import React from "react";
import { useNavigate } from "react-router-dom";
import PostPreviewCard from "../components/PostPreviewCard";
import logo from "../assets/MO-YEOlogo.svg";
import projectIcon from "../assets/project.svg";
import postIcon from "../assets/post.svg";
import Input from "../components/input";
import Member from "../assets/footer/member.svg?react";
import HomeBoard from "../assets/homeBoard.svg?react";
import Time from "../assets/time.svg?react";

// 1. 프로젝트 카드 컴포넌트 (팀원분 스타일 반영)
interface ProjectCardProps {
  title: string;
  author: string;
  members: number;
  time: string;
}

const post = [
  {
    postId: 1,
    title: "아자아자화이팅?...",
    author: "쑤기쑤기",
    likeCount: 2,
    commentCount: 2,
    createdAt: "2026-04-01",
  },
];
const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  author,
  members,
  time,
}) => {
  return (
    <div className="rounded-[14px] border border-[#E2E8F0] bg-white p-[17px] shadow-[0_2px_8px_rgba(15,23,42,0.06)] mb-3">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-bold text-[#1E293B] truncate mb-2">
            {title}
          </h3>
          <p className="text-[12px] text-[#64748B]">작성자: {author}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[#94A3B8] text-[12px]">
          <span className="flex items-center gap-1">
            <Member className="size-[14px]" /> {members}명
          </span>
          <span className="flex items-center gap-1">
            <Time className="size-[14px]" /> {time}
          </span>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    /* 팀원분 MyPage 규격: 430px 고정 및 중앙 정렬 */
    <main className="mx-auto min-h-screen w-full max-w-[430px] bg-[#F8FAFC] pb-[100px] relative">
      {/* 2. 블루 헤더 섹션 (로고 파일 사용 및 좌측 정렬) */}
      <header className="bg-[#2F6BFF] pt-5 pb-12 px-6 shadow-lg relative z-10">
        <div className="flex items-center justify-start mb-8 gap-3">
          {/* 이미지 태그로 깔끔하게 로고 삽입 */}
          <img
            src={logo}
            alt="MO-YEO Logo"
            className="w-[35px] h-[35px] shrink-0"
          />
          <h1 className="text-white text-[28px] font-bold leading-none">
            MO-YEO
          </h1>
        </div>

        {/* 검색바 */}
        <div className="relative">
          <Input placeholder="프로젝트, 팀원 검색..." />
        </div>
      </header>

      {/* 3. 퀵 메뉴 (팀원 찾기 / 전체 게시판) */}
      <section className="grid grid-cols-2 gap-3 px-5 pt-[30px] relative text-white">
        <button
          onClick={() => navigate("/member")}
          className="bg-gradient-to-r from-[#155DFC] to-[#2B7FFF] p-4 rounded-[14px] shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex flex-col items-start border border-[#E2E8F0] transition-all active:scale-95 cursor-pointer"
        >
          <Member className="size-7" />
          <span className="font-bold text-[14px] mt-2">팀원 찾기</span>
          <span className="text-[11px] mt-0.5">최적의 팀 빌딩</span>
        </button>
        <button
          onClick={() => navigate("/board")}
          className="bg-gradient-to-r from-[#155DFC] to-[#2B7FFF] p-4 rounded-[14px] shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex flex-col items-start border border-[#E2E8F0] transition-all active:scale-95 cursor-pointer"
        >
          <HomeBoard className="size-7" />
          <span className="font-bold text-[14px] mt-2">전체 게시판</span>
          <span className="text-[11px] mt-0.5">정보 주고받기</span>
        </button>
      </section>

      {/* 4. 최근 프로젝트 섹션 */}
      <section className="px-5 mt-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <img src={projectIcon} alt="" className="w-5 h-5" />
            <h2 className="font-bold text-[18px] text-[#1E293B]">
              최근 프로젝트
            </h2>
          </div>
          <button
            className="text-[13px] text-[#2563EB] font-bold cursor-pointer"
            onClick={() => navigate("/project")}
          >
            전체보기
          </button>
        </div>
        <ProjectCard
          title="2026 ICT 공모전 팀원 모집"
          author="김가톨릭"
          members={5}
          time="2일 후"
        />
        <ProjectCard
          title="졸업작품 프론트엔드 구인"
          author="이코딩"
          members={3}
          time="5일 후"
        />
      </section>

      {/* 5. 최근 게시글 섹션 (PostPreviewCard 사용) */}
      <section className="px-5 mt-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <img src={postIcon} alt="" className="w-5 h-5" />
            <h2 className="font-bold text-[18px] text-[#1E293B]">
              최근 게시글
            </h2>
          </div>
          <button
            className="text-[13px] text-[#2563EB] font-bold cursor-pointer"
            onClick={() => navigate("/board")}
          >
            더보기
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {post.map((p) => (
            <div
              key={p.postId}
              onClick={() => navigate(`/board/${p.postId}`)}
              className="cursor-pointer"
            >
              <PostPreviewCard
                title={p.title}
                likeCount={p.likeCount}
                commentCount={p.commentCount}
                date={new Date(p.createdAt).toLocaleDateString()}
                author={p.author}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;