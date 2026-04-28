import React from "react";
import { useNavigate } from "react-router-dom";
import PostPreviewCard from "../components/PostPreviewCard";
import logo from "../assets/MO-YEOlogo.svg"; 
import projectIcon from "../assets/project.svg";
import postIcon from "../assets/post.svg";
import Input from "../components/input"; // 공통 Input 컴포넌트 사용
import { useQuery } from "@tanstack/react-query";
import { recruitsApi } from "../api/recruits";
import { boardsApi } from "../api/boards";
import { membersApi } from "../api/member";

// ✅ 아이콘 에셋 (팀원분 경로 기준)
import Member from "../assets/footer/member.svg?react";
import HomeBoard from "../assets/homeBoard.svg?react";
import Time from "../assets/time.svg?react";

// 1. 프로젝트 카드 컴포넌트 (팀원분 레이아웃: 14px 곡률, 그림자 효과)
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
  return (
    <div 
      onClick={onClick}
      className="rounded-[14px] border border-[#E2E8F0] bg-white p-[17px] shadow-[0_2px_8px_rgba(15,23,42,0.06)] mb-3 cursor-pointer transition-all active:scale-[0.98] text-left"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-bold text-[#1E293B] truncate mb-2">{title}</h3>
          <p className="text-[12px] text-[#64748B]">방장: {author}</p>
        </div>
        {/* 태그 디자인 유지 */}
        <span className="bg-[#EFF6FF] text-[#1447E6] text-[10px] px-2.5 py-1 rounded-[8px] font-bold shrink-0">
          {tag}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-gray-50 pt-3">
        <div className="flex items-center gap-3 text-[#94A3B8] text-[12px]">
          <span className="flex items-center gap-1">
            <Member className="size-[14px]" /> {members}/{maxMembers}명
          </span>
          <span className="flex items-center gap-1">
            <Time className="size-[14px]" /> {time}
          </span>
        </div>
        <span className="text-[12px] font-bold text-[#2563EB]">참여하기</span>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  // API 호출
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
    /* 규격: 430px 고정 및 중앙 정렬 */
    <main className="mx-auto min-h-screen w-full max-w-[430px] bg-[#F8FAFC] pb-[100px] relative shadow-2xl">
      
      {/* 2. 블루 헤더 섹션 (곡률 40px 및 좌측 정렬 레이아웃) */}
      <header className="bg-[#2F6BFF] pt-14 pb-16 px-6 rounded-b-[40px] shadow-lg relative z-10 overflow-hidden">
        {/* 배경 장식 원 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        
        <div className="flex items-center justify-between mb-8 relative z-20">
          <div className="flex items-center justify-start gap-3">
            <img src={logo} alt="Logo" className="w-[35px] h-[35px] shrink-0" />
            <h1 className="text-white text-[28px] font-bold leading-none italic tracking-tighter">MO-YEO</h1>
          </div>
          {profile && (
            <div className="text-white text-[12px] font-bold bg-white/20 px-3 py-1.5 rounded-full cursor-pointer" onClick={() => navigate('/my')}>
              {profile.nickname}님 👋
            </div>
          )}
        </div>
        
        <div className="relative z-20">
          <Input placeholder="프로젝트, 팀원 검색..." />
        </div>
      </header>

      {/* 3. 퀵 메뉴 (헤더에 걸쳐진 -mt-6 레이아웃) */}
      <section className="grid grid-cols-2 gap-3 px-5 -mt-8 relative z-20 text-white">
        <button 
          onClick={() => navigate('/member')} 
          className="bg-gradient-to-r from-[#155DFC] to-[#2B7FFF] p-5 rounded-[24px] shadow-[0_8px_20px_rgba(0,0,0,0.1)] border border-white/10 flex flex-col items-start transition-all active:scale-95 cursor-pointer"
        >
          <Member className="size-8" />
          <span className="font-bold text-[15px] mt-3">팀원 찾기</span>
          <span className="text-[11px] opacity-80 mt-0.5">최적의 팀 빌딩</span>
        </button>
        <button 
          onClick={() => navigate('/board')} 
          className="bg-gradient-to-r from-[#155DFC] to-[#2B7FFF] p-5 rounded-[24px] shadow-[0_8px_20px_rgba(0,0,0,0.1)] border border-white/10 flex flex-col items-start transition-all active:scale-95 cursor-pointer"
        >
          <HomeBoard className="size-8" />
          <span className="font-bold text-[15px] mt-3">전체 게시판</span>
          <span className="text-[11px] opacity-80 mt-0.5">정보 주고받기</span>
        </button>
      </section>

      {/* 4. 최근 프로젝트 섹션 */}
      <section className="px-5 mt-10 text-left">
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-2">
            <img src={projectIcon} alt="" className="w-5 h-5" />
            <h2 className="font-bold text-[18px] text-[#1E293B]">최근 프로젝트</h2>
          </div>
          <button className="text-[13px] text-[#2563EB] font-bold cursor-pointer" onClick={() => navigate('/project')}>전체보기</button>
        </div>
        
        {recruitsLoading ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400 animate-pulse">...</div>
        ) : recentRecruits?.recruits?.length ? (
          recentRecruits.recruits.map((post: any) => (
            <ProjectCard 
              key={post.recruitId}
              title={post.title} 
              author={post.author.nickname} 
              members={post.applicantCount} 
              maxMembers={post.totalHeadcount}
              time={`${new Date(post.deadline).getMonth() + 1}/${new Date(post.deadline).getDate()} 마감`}
              tag={post.activityCategory || 'ACADEMIC'}
              onClick={() => navigate(`/projects/${post.recruitId}`)}
            />
          ))
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-400 text-sm">등록된 프로젝트가 없습니다.</div>
        )}
      </section>

      {/* 5. 최근 게시글 섹션 */}
      <section className="px-5 mt-10 text-left">
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-2">
            <img src={postIcon} alt="" className="w-5 h-5" />
            <h2 className="font-bold text-[18px] text-[#1E293B]">인기 게시글</h2>
          </div>
          <button className="text-[13px] text-[#2563EB] font-bold cursor-pointer" onClick={() => navigate('/board')}>더보기</button>
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
                  author={p.author?.nickname || "익명"}
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