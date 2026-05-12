import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostPreviewCard from "../components/PostPreviewCard";
import logo from "../assets/MO-YEOlogo.svg";
import projectIcon from "../assets/project.svg";
import postIcon from "../assets/post.svg";
import Input from "../components/input";
import { useQuery } from "@tanstack/react-query";
import { recruitsApi } from "../api/recruits";
import { boardsApi } from "../api/boards";
import { membersApi } from "../api/member";

import Member from "../assets/footer/member.svg?react";
import HomeBoard from "../assets/homeBoard.svg?react";
import Time from "../assets/time.svg?react";

interface ProjectCardProps {
  title: string;
  author: string;
  members: number;
  maxMembers: number;
  time: string;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  author,
  members,
  maxMembers,
  time,
  onClick,
}) => {
  return (
    <div 
      onClick={onClick}
      className="rounded-[14px] border border-[#E2E8F0] bg-white p-[17px] shadow-[0_2px_8px_rgba(15,23,42,0.06)] mb-3 cursor-pointer transition-all active:scale-[0.98] text-left"
    >
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
            <Member className="size-[14px]" /> {members}/{maxMembers}명
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

  // 1. 내 프로필 정보 가져오기
  const { data: profile } = useQuery({
    queryKey: ['myProfile'],
    queryFn: membersApi.getMyProfile,
    retry: 0,
  });

  // ✅ [신규 추가] 가톨릭대 이메일 검증 로직
  useEffect(() => {
    if (profile && profile.email) {
      const emailDomain = "@catholic.ac.kr";
      if (!profile.email.endsWith(emailDomain)) {
        alert("가톨릭대학교 학생 메일(@catholic.ac.kr)로만 이용 가능한 서비스입니다.\n가톨릭대 메일로 다시 로그인해 주세요.");
        
        // 로컬 토큰 삭제 (자동 로그인 방지)
        localStorage.removeItem("access_token");
        
        // 로그인 페이지로 강제 이동
        navigate("/login", { replace: true });
      }
    }
  }, [profile, navigate]);

  const { data: recentRecruits, isLoading: recruitsLoading } = useQuery({
    queryKey: ['recruits', 'recent'],
    queryFn: () => recruitsApi.getRecruits({ size: 3 }),
  });

  const { data: recentPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['boards', 'recent'],
    queryFn: () => boardsApi.getPosts({ size: 3 }),
  });

  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] bg-[#F8FAFC] pb-[100px] relative">
      <header className="bg-[#2F6BFF] pt-5 pb-12 px-6 shadow-lg relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center justify-start gap-3">
            <img src={logo} alt="MO-YEO Logo" className="w-[35px] h-[35px] shrink-0" />
            <h1 className="text-white text-[28px] font-bold leading-none">MO-YEO</h1>
          </div>
          {profile && (
            <div 
              className="text-white text-[12px] font-bold bg-white/20 px-3 py-1.5 rounded-full cursor-pointer"
              onClick={() => navigate('/my')}
            >
              {profile.nickname}님 👋
            </div>
          )}
        </div>
        <div className="relative">
          <Input placeholder="프로젝트, 팀원 검색..." />
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 px-5 pt-[30px] relative text-white">
        <button
          onClick={() => navigate("/members")}
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

      <section className="px-5 mt-10 text-left">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <img src={projectIcon} alt="" className="w-5 h-5" />
            <h2 className="font-bold text-[18px] text-[#1E293B]">최근 프로젝트</h2>
          </div>
          <button className="text-[13px] text-[#2563EB] font-bold cursor-pointer" onClick={() => navigate("/project")}>전체보기</button>
        </div>

        {recruitsLoading ? (
          <div className="py-10 text-center text-gray-300 animate-pulse">불러오는 중...</div>
        ) : recentRecruits?.recruits?.length ? (
          recentRecruits.recruits.map((p: any) => (
            <ProjectCard
              key={p.recruitId}
              title={p.title}
              author={p.author.nickname}
              members={p.applicantCount}
              maxMembers={p.totalHeadcount}
              time={`${new Date(p.deadline).getMonth() + 1}/${new Date(p.deadline).getDate()} 마감`}
              onClick={() => navigate(`/projects/${p.recruitId}`)}
            />
          ))
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-400 text-sm">등록된 프로젝트가 없습니다.</div>
        )}
      </section>

      <section className="px-5 mt-10 text-left">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <img src={postIcon} alt="" className="w-5 h-5" />
            <h2 className="font-bold text-[18px] text-[#1E293B]">최근 게시글</h2>
          </div>
          <button className="text-[13px] text-[#2563EB] font-bold cursor-pointer" onClick={() => navigate("/board")}>더보기</button>
        </div>
        <div className="flex flex-col gap-3">
          {postsLoading ? (
            <div className="py-4 text-center text-gray-300">...</div>
          ) : recentPosts?.posts?.length ? (
            recentPosts.posts.map((p: any) => (
              <div key={p.postId} onClick={() => navigate(`/board/${p.postId}`)} className="cursor-pointer">
                <PostPreviewCard
                  title={p.title}
                  likeCount={p.likeCount}
                  commentCount={p.commentCount}
                  date={new Date(p.createdAt).toLocaleDateString()}
                  author={p.author?.nickname || p.author}
                />
              </div>
            ))
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center text-gray-400 text-sm">작성된 게시글이 없습니다.</div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;