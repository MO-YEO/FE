import React from "react";
import { useNavigate } from "react-router-dom";
import PostPreviewCard from "../components/PostPreviewCard";
import logo from "../assets/MO-YEOlogo.svg"; 
import projectIcon from "../assets/project.svg";
import postIcon from "../assets/post.svg";
import { useQuery } from "@tanstack/react-query";
import { recruitsApi } from "../api/recruits";
import { boardsApi } from "../api/boards";
import { membersApi } from "../api/member";

// 프로젝트 카드 컴포넌트
interface ProjectCardProps {
  title: string;
  author: string;
  members: number;
  maxMembers: number;
  time: string;
  tag: string;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, author, members, maxMembers, time, tag, onClick }) => {
  const tagColor: Record<string, string> = {
    PLAN: "bg-[#EFF6FF] text-[#1447E6]",
    DEVELOP: "bg-[#F0FDF4] text-[#16A34A]",
    DESIGN: "bg-[#FFF7ED] text-[#EA580C]",
    MARKETING: "bg-[#FAF5FF] text-[#7E22CE]",
    ACADEMIC: "bg-[#F1F5F9] text-[#475569]",
  };

  return (
    <div 
      onClick={onClick}
      className="rounded-[18px] border border-[#E2E8F0] bg-white p-[20px] shadow-sm mb-3 cursor-pointer transition-all active:scale-[0.98] hover:shadow-md"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-bold text-[#1E293B] truncate mb-1">{title}</h3>
          <p className="text-[12px] text-[#64748B]">방장: {author}</p>
        </div>
        <span className={`${tagColor[tag] || "bg-gray-100 text-gray-600"} text-[10px] px-2.5 py-1 rounded-[8px] font-bold shrink-0`}>
          {tag}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[#94A3B8] text-[12px] font-medium">
          <span className="flex items-center gap-1">👥 {members}/{maxMembers}명</span>
          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
          <span className="flex items-center gap-1">🕒 {time}</span>
        </div>
        <span className="text-[12px] font-bold text-[#2563EB]">참여하기</span>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['myProfile'],
    queryFn: membersApi.getMyProfile,
    retry: 0,
  });

  const { data: recentRecruits, isLoading: recruitsLoading } = useQuery({
    queryKey: ['recruits', 'recent'],
    queryFn: () => recruitsApi.getRecruits({ size: 3 }),
  });

  const { data: recentPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['boards', 'recent'],
    queryFn: () => boardsApi.getPosts({ size: 3 }),
  });

  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] bg-[#F8FAFC] pb-[100px] font-sans relative shadow-xl">
      
      {/* 블루 헤더 섹션 */}
      <header className="bg-[#5C7CFF] pt-14 pb-12 px-6 rounded-b-[40px] shadow-lg relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        
        <div className="flex items-center justify-between mb-8 relative z-20">
          <div className="flex items-center justify-start gap-3">
            <img src={logo} alt="Logo" className="w-[32px] h-[32px] filter brightness-0 invert" />
            <h1 className="text-white text-[26px] font-black tracking-tighter italic">MO-YEO</h1>
          </div>
          {profile && (
            <div className="text-white text-[13px] font-bold bg-white/20 px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/30" onClick={() => navigate('/my')}>
              {profile.nickname}님 👋
            </div>
          )}
        </div>
        
        <div className="relative z-20">
          <input
            type="text"
            placeholder="함께할 팀원을 검색해보세요"
            className="w-full h-[52px] px-12 rounded-[18px] bg-white shadow-xl focus:outline-none text-[15px] placeholder:text-gray-400 border-none"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px]">🔍</span>
        </div>
      </header>

      {/* 퀵 메뉴 */}
      <section className="grid grid-cols-2 gap-4 px-5 -mt-6 relative z-20">
        <button onClick={() => navigate('/members')} className="bg-white p-5 rounded-[24px] shadow-md border border-[#E2E8F0] flex flex-col items-start transition-all active:scale-95">
          <div className="bg-[#EFF6FF] w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl">👥</div>
          <span className="font-bold text-[15px] text-[#1E293B]">팀원 찾기</span>
          <span className="text-[11px] text-[#64748B] mt-1">최적의 파트너 매칭</span>
        </button>
        <button onClick={() => navigate('/board')} className="bg-white p-5 rounded-[24px] shadow-md border border-[#E2E8F0] flex flex-col items-start transition-all active:scale-95">
          <div className="bg-[#F0FDF4] w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl">💬</div>
          <span className="font-bold text-[15px] text-[#1E293B]">자유 게시판</span>
          <span className="text-[11px] text-[#64748B] mt-1">실시간 정보 교류</span>
        </button>
      </section>

      {/* 최근 프로젝트 섹션 */}
      <section className="px-5 mt-10 text-left">
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-2">
            <img src={projectIcon} alt="" className="w-5 h-5" />
            <h2 className="font-bold text-[18px] text-[#1E293B]">최근 프로젝트</h2>
          </div>
          <button className="text-[13px] text-[#2563EB] font-bold" onClick={() => navigate('/project')}>전체보기</button>
        </div>
        
        {recruitsLoading ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400 text-sm animate-pulse">불러오는 중...</div>
        ) : recentRecruits?.recruits?.length ? (
          recentRecruits.recruits.map((post: any) => (
            <ProjectCard 
              key={post.recruitId}
              title={post.title} 
              author={post.author.nickname} 
              members={post.applicantCount} 
              maxMembers={post.totalHeadcount}
              time={new Date(post.deadline).toLocaleDateString()} 
              tag={post.activityCategory || 'ACADEMIC'}
              onClick={() => navigate(`/projects/${post.recruitId}`)}
            />
          ))
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-400 text-sm">등록된 프로젝트가 없습니다.</div>
        )}
      </section>

      {/* 실시간 게시글 섹션 */}
      <section className="px-5 mt-10 text-left">
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-2">
            <img src={postIcon} alt="" className="w-5 h-5" />
            <h2 className="font-bold text-[18px] text-[#1E293B]">인기 게시글</h2>
          </div>
          <button className="text-[13px] text-[#2563EB] font-bold" onClick={() => navigate('/board')}>더보기</button>
        </div>
        <div className="flex flex-col gap-3">
          {postsLoading ? (
            <div className="py-4 text-center text-gray-300">...</div>
          ) : recentPosts?.posts?.length ? (
            recentPosts.posts.map((post: any) => (
              <div key={post.postId} onClick={() => navigate(`/board/${post.postId}`)} className="cursor-pointer">
                <PostPreviewCard 
                  title={post.title} 
                  likeCount={post.likeCount} 
                  commentCount={post.commentCount} 
                  date={new Date(post.createdAt).toLocaleDateString()} 
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