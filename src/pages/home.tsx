import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostPreviewCard from '../components/PostPreviewCard'; 
import logo from "../assets/MO-YEOlogo.svg";
import projectIcon from "../assets/project.svg";
import postIcon from "../assets/post.svg";
import Input from "../components/input";
import { useQuery } from "@tanstack/react-query";
import { recruitsApi } from "../api/recruits";
import { boardsApi } from "../api/boards";
import { membersApi } from "../api/member";
import { aiRecommendApi } from "../api/aiRecommend";
import type { AIRecommendation } from "../api/aiRecommend";

import Member from "../assets/footer/member.svg?react";
import HomeBoard from "../assets/homeBoard.svg?react";
import Time from "../assets/time.svg?react";

type SearchType = 'project' | 'board';

const formatRelativeTime = (dateString?: string) => {
  if (!dateString) return "방금 전";
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  
  return past.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const formatDeadline = (dateString?: string) => {
  if (!dateString) return "마감임박";
  const datePart = dateString.split("T")[0];
  const parts = datePart.split("-");
  if (parts.length >= 3) {
    return `${parts[1]}-${parts[2]}`;
  }
  return dateString;
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>('project');

  const { data: profile } = useQuery({
    queryKey: ['myProfile'],
    queryFn: membersApi.getMyProfile,
    retry: 0,
  });

  const { data: recruitsData, isLoading: recruitsLoading } = useQuery({
    queryKey: ['recruits', 'recent'],
    queryFn: () => recruitsApi.getRecruits({ size: 20 }),
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['boards', 'recent'],
    queryFn: () => boardsApi.getPosts({ size: 20 }),
  });

  const hasToken = !!localStorage.getItem('access_token');

  // 🚀 백엔드 추천 데이터 파이프라인 연동
  const { data: aiRecommendData, isLoading: aiLoading } = useQuery<AIRecommendation[]>({
    queryKey: ['recruits', 'recommendation', 'list'],
    queryFn: aiRecommendApi.getAiRecommendations,
    enabled: hasToken && !!profile,
    staleTime: 1000 * 5, 
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });

  // 백엔드 매칭 점수가 가장 높은 프로젝트를 부동의 1위로 정렬 및 선정
  const validRecommendations = aiRecommendData ? [...aiRecommendData] : [];
  const bestMatch: any = validRecommendations.sort((a, b) => b.matchingScore - a.matchingScore)[0];

  useEffect(() => {
    if (profile && profile.email) {
      if (!profile.email.endsWith("@catholic.ac.kr")) {
        alert("가톨릭대학교 학생 메일로만 이용 가능합니다.");
        localStorage.removeItem("access_token");
        navigate("/login", { replace: true });
      }
    }
  }, [profile, navigate]);

  const recruitsList = Array.isArray(recruitsData) ? recruitsData : (recruitsData?.recruits || []);
  const filteredRecruits = recruitsList.filter((p: any) => p?.title?.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

  const postsList = Array.isArray(postsData) ? postsData : (postsData?.posts || []);
  const filteredPosts = postsList.filter((p: any) => p?.title?.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

  return (
    <main className="mx-auto min-h-screen w-full max-w-[400px] bg-[#F8FAFC] pb-[100px] relative text-left shadow-2xl">
      <header className="bg-[#2F6BFF] pt-5 pb-12 px-5 shadow-lg relative z-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-[35px] h-[35px]" />
            <h1 className="text-white text-[28px] font-bold">MO-YEO</h1>
          </div>
          {profile && (
            <div className="text-white text-[12px] font-bold bg-white/20 px-3 py-1.5 rounded-full cursor-pointer" onClick={() => navigate('/my')}>
              {profile.nickname}님 👋
            </div>
          )}
        </div>

        <div className="relative flex gap-2">
          <select 
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value as SearchType);
              setSearchQuery(""); 
            }}
            className="bg-white/10 text-white text-[13px] font-bold rounded-[12px] px-2 outline-none border border-white/20 cursor-pointer"
          >
            <option value="project" className="text-black">프로젝트</option>
            <option value="board" className="text-black">게시글</option>
          </select>
          <div className="flex-1">
            <Input 
              placeholder={`${searchType === 'project' ? '프로젝트' : '게시글'} 실시간 검색...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 px-5 pt-[30px] text-white">
        <button onClick={() => navigate("/member")} className="bg-gradient-to-r from-[#155DFC] to-[#2B7FFF] p-4 rounded-[14px] flex flex-col items-start active:scale-95 transition-all">
          <Member className="size-7" />
          <span className="font-bold text-[14px] mt-2">팀원 찾기</span>
        </button>
        <button onClick={() => navigate("/board")} className="bg-gradient-to-r from-[#155DFC] to-[#2B7FFF] p-4 rounded-[14px] flex flex-col items-start active:scale-95 transition-all">
          <HomeBoard className="size-7" />
          <span className="font-bold text-[14px] mt-2">전체 게시판</span>
        </button>
      </section>

      <div className="px-5 mt-10">
        {searchQuery ? (
          <div>
            <h2 className="font-bold text-[18px] text-[#1E293B] mb-4">'{searchQuery}' 검색 결과</h2>
            {searchType === 'project' && (
              <div className="flex flex-col">
                {filteredRecruits.length > 0 ? filteredRecruits.map((p: any) => (
                  <ProjectCard key={p.recruitId} title={p.title} author={p.author?.nickname || "모집중"} members={p.applicantCount} maxMembers={p.totalHeadcount} time={formatDeadline(p.deadline)} onClick={() => navigate(`/project/${p.recruitId}`)} />
                )) : <EmptyState />}
              </div>
            )}
            {searchType === 'board' && (
              <div className="flex flex-col gap-3">
                {filteredPosts.length > 0 ? filteredPosts.map((p: any) => (
                  <div key={p.postId} onClick={() => navigate(`/board/${p.postId}`)} className="cursor-pointer">
                    <PostPreviewCard title={p.title} likeCount={p.likeCount} commentCount={p.commentCount} date={formatRelativeTime(p.createdAt)} author={p.author?.nickname || p.author} />
                  </div>
                )) : <EmptyState />}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] p-1.5 rounded-lg text-white font-bold text-[11px] flex items-center gap-1 shadow-sm">
                  <span>AI 추천</span>
                </div>
                <h2 className="font-bold text-[18px] text-[#1E293B]">나를 위한 맞춤 프로젝트</h2>
              </div>

              {aiLoading ? (
                <div className="rounded-[20px] border border-[#F3E8FF] bg-gradient-to-b from-white to-[#FAF5FF] p-[24px] shadow-sm animate-pulse text-center text-[#8B5CF6] text-[13px] font-bold">최적 프로젝트 분석 및 엄선 중...</div>
              ) : bestMatch ? (
                // 💡 [개조 포인트] 백엔드에서 내려온 일치하는 기술 스택 리스트와 부족한 스택 리스트를 컴포넌트에 통째로 넘깁니다.
                <AIProjectCard 
                  title={bestMatch.title} 
                  matchingScore={bestMatch.matchingScore} 
                  matchedSkills={bestMatch.matchedSkills || []}
                  missingSkills={bestMatch.missingSkills || []}
                  onClick={() => navigate(`/project/${bestMatch.recruitPostId}`)} 
                />
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400 text-xs">현재 추천 가능한 프로젝트가 없습니다.</div>
              )}
            </div>

            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2"><img src={projectIcon} alt="" className="w-5 h-5" /><h2 className="font-bold text-[18px] text-[#1E293B]">최근 프로젝트</h2></div>
                <button className="text-[13px] text-[#2563EB] font-bold" onClick={() => navigate("/project")}>전체보기</button>
              </div>
              {recruitsLoading ? <div className="w-full h-[80px] bg-white rounded-[14px] animate-pulse mb-3" /> : recruitsList.slice(0, 3).map((p: any) => <ProjectCard key={p.recruitId} title={p.title} author={p.author?.nickname || "작성자"} members={p.applicantCount} maxMembers={p.totalHeadcount} time={formatDeadline(p.deadline)} onClick={() => navigate(`/project/${p.recruitId}`)} />)}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2"><img src={postIcon} alt="" className="w-5 h-5" /><h2 className="font-bold text-[18px] text-[#1E293B]">최근 게시글</h2></div>
                <button className="text-[13px] text-[#2563EB] font-bold" onClick={() => navigate("/board")}>더보기</button>
              </div>
              <div className="flex flex-col gap-3">{postsLoading ? <div className="w-full h-[60px] bg-white rounded-[14px] animate-pulse" /> : postsList.slice(0, 3).map((p: any) => <div key={p.postId} onClick={() => navigate(`/board/${p.postId}`)} className="cursor-pointer"><PostPreviewCard title={p.title} likeCount={p.likeCount} commentCount={p.commentCount} date={formatRelativeTime(p.createdAt)} author={p.author?.nickname || p.author} /></div>)}</div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

const ProjectCard: React.FC<any> = ({ title, author, members, maxMembers, time, onClick }) => (
  <div onClick={onClick} className="rounded-[14px] border border-[#E2E8F0] bg-white p-[17px] shadow-sm mb-3 active:scale-[0.98] transition-all cursor-pointer">
    <h3 className="text-[16px] font-bold text-[#1E293B] truncate mb-2">{title}</h3>
    <div className="flex items-center justify-between text-[#94A3B8] text-[12px]">
      <span>작성자: {author}</span>
      <div className="flex items-center gap-3"><span className="flex items-center gap-1"><Member className="size-[13px]" /> {members}/{maxMembers}</span><span className="flex items-center gap-1"><Time className="size-[13px]" /> {time}</span></div>
    </div>
  </div>
);

// 💡 [디자인 완전 개조] 구구절절한 줄글 코멘트를 완전히 지우고, 스택 일치 여부를 매칭 칩(Chip) 형태로 세분화해서 보여줍니다.
const AIProjectCard: React.FC<any> = ({ title, matchingScore, matchedSkills, missingSkills, onClick }) => (
  <div onClick={onClick} className="rounded-[20px] border border-[#E0E7FF] bg-gradient-to-b from-white to-[#EEF2FF] p-[20px] shadow-md active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden">
    <div className="absolute top-4 right-4 bg-[#EEF2FF] border border-[#C7D2FE] text-[#4F46E5] font-extrabold text-[12.5px] px-3 py-1 rounded-full shadow-sm">
      적합도 {matchingScore}%
    </div>
    
    <h3 className="text-[16.5px] font-black text-[#1E293B] w-[65%] truncate mb-4">{title}</h3>
    
    <div className="space-y-3 pt-1 border-t border-dashed border-gray-200">
      {/* 🟢 보유 스택 매칭 현황 */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-bold text-[#10B981] bg-[#ECFDF5] px-1.5 py-0.5 rounded mr-1">보유 스택 일치</span>
        {matchedSkills.length > 0 ? (
          matchedSkills.map((skill: string, idx: number) => (
            <span key={idx} className="text-[11px] bg-white border border-[#A7F3D0] text-[#065F46] px-2 py-0.5 rounded-full font-semibold uppercase">
              {skill}
            </span>
          ))
        ) : (
          <span className="text-[11px] text-gray-400 font-medium">일치하는 스택 없음</span>
        )}
      </div>

      {/* 🔴 부족 스택 매칭 현황 */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-bold text-[#EF4444] bg-[#FEF2F2] px-1.5 py-0.5 rounded mr-1">추가 요구 스택</span>
        {missingSkills.length > 0 ? (
          missingSkills.map((skill: string, idx: number) => (
            <span key={idx} className="text-[11px] bg-white border border-[#FCA5A5] text-[#991B1B] px-2 py-0.5 rounded-full font-semibold uppercase">
              {skill}
            </span>
          ))
        ) : (
          <span className="text-[11px] text-gray-400 font-medium">없음 (스택 완벽 일치!)</span>
        )}
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400 text-sm">일치하는 검색 결과가 없습니다.</div>
);

export default Home;