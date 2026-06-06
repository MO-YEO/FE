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

  const { data: aiRecommendData, isLoading: aiLoading, isFetching: aiFetching } = useQuery<AIRecommendation[]>({
    queryKey: ['recruits', 'recommendation'],
    queryFn: aiRecommendApi.getAiRecommendations,
    enabled: !!profile,
  });

  useEffect(() => {
    if (aiRecommendData && aiRecommendData.length > 0) {
      const firstRecommend = aiRecommendData[0];
      const comment = firstRecommend.aiComment;

      if (comment && comment.trim() !== "") {
        localStorage.setItem("cached_ai_comment", comment);
        localStorage.setItem("cached_ai_project_title", firstRecommend.title || "");
        localStorage.setItem("cached_ai_score", String(firstRecommend.matchingScore || 0));
        localStorage.setItem("cached_ai_post_id", String(firstRecommend.recruitPostId || ""));
      }
    }
  }, [aiRecommendData]);

  useEffect(() => {
    if (profile && profile.email) {
      if (!profile.email.endsWith("@catholic.ac.kr")) {
        alert("가톨릭대학교 학생 메일로만 이용 가능합니다.");
        localStorage.removeItem("access_token");
        navigate("/login", { replace: true });
      }
    }
  }, [profile, navigate]);

  const recruitsList = Array.isArray(recruitsData)
    ? recruitsData
    : (recruitsData?.recruits || []);

  const filteredRecruits = recruitsList.filter((p: any) => 
    p?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const postsList = Array.isArray(postsData)
    ? postsData
    : (postsData?.posts || []);

  const filteredPosts = postsList.filter((p: any) => 
    p?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const isAiProcessing = aiLoading || (aiFetching && !aiRecommendData);

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
        <button 
          onClick={() => navigate("/member")} 
          className="bg-gradient-to-r from-[#155DFC] to-[#2B7FFF] p-4 rounded-[14px] flex flex-col items-start active:scale-95 transition-all"
        >
          <Member className="size-7" />
          <span className="font-bold text-[14px] mt-2">팀원 찾기</span>
        </button>
        <button 
          onClick={() => navigate("/board")} 
          className="bg-gradient-to-r from-[#155DFC] to-[#2B7FFF] p-4 rounded-[14px] flex flex-col items-start active:scale-95 transition-all"
        >
          <HomeBoard className="size-7" />
          <span className="font-bold text-[14px] mt-2">전체 게시판</span>
        </button>
      </section>

      <div className="px-5 mt-10">
        {searchQuery ? (
          <div>
            <h2 className="font-bold text-[18px] text-[#1E293B] mb-4">
              '{searchQuery}' 검색 결과
            </h2>
            
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

              {isAiProcessing ? (
                <div className="rounded-[20px] border border-[#F3E8FF] bg-gradient-to-b from-white to-[#FAF5FF] p-[24px] shadow-sm flex flex-col items-center justify-center gap-3 animate-pulse">
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-[#8B5CF6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-[14px] font-extrabold text-[#7C3AED]">AI 맞춤 분석 진행 중</span>
                  </div>
                  <p className="text-[12px] text-[#8B5CF6] font-medium tracking-tight text-center">
                    프로필을 기반으로 최적의 프로젝트 모집글을 실시간 매칭하고 있습니다...
                  </p>
                </div>
              ) : (aiRecommendData && aiRecommendData.length > 0) || localStorage.getItem("cached_ai_comment") ? (
                (() => {
                  const topMatch: AIRecommendation | null = aiRecommendData && aiRecommendData.length > 0 ? aiRecommendData[0] : null;

                  const localComment = localStorage.getItem("cached_ai_comment");
                  const localTitle = localStorage.getItem("cached_ai_project_title");
                  const localScore = Number(localStorage.getItem("cached_ai_score") || 0);
                  const localPostId = localStorage.getItem("cached_ai_post_id");

                  const finalTitle = topMatch ? topMatch.title : (localTitle || "추천 프로젝트");
                  const finalScore = topMatch ? topMatch.matchingScore : localScore;
                  const finalPostId = topMatch ? topMatch.recruitPostId : (localPostId || "");
                  const finalComment = topMatch ? topMatch.aiComment : (localComment || "추천 코멘트를 불러올 수 없습니다.");

                  return (
                    <AIProjectCard 
                      title={finalTitle} 
                      matchingScore={finalScore} 
                      aiComment={finalComment} 
                      onClick={() => {
                        if (finalPostId) navigate(`/project/${finalPostId}`);
                      }} 
                    />
                  );
                })()
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400 text-xs">
                  마이페이지에 기술 스택을 등록하면 맞춤 매칭이 활성화됩니다.
                </div>
              )}
            </div>

            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <img src={projectIcon} alt="" className="w-5 h-5" />
                  <h2 className="font-bold text-[18px] text-[#1E293B]">최근 프로젝트</h2>
                </div>
                <button className="text-[13px] text-[#2563EB] font-bold" onClick={() => navigate("/project")}>전체보기</button>
              </div>
              {recruitsLoading ? (
                <div className="w-full h-[80px] bg-white rounded-[14px] animate-pulse mb-3" />
              ) : recruitsList.slice(0, 3).map((p: any) => (
                <ProjectCard key={p.recruitId} title={p.title} author={p.author?.nickname || "작성자"} members={p.applicantCount} maxMembers={p.totalHeadcount} time={formatDeadline(p.deadline)} onClick={() => navigate(`/project/${p.recruitId}`)} />
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <img src={postIcon} alt="" className="w-5 h-5" />
                  <h2 className="font-bold text-[18px] text-[#1E293B]">최근 게시글</h2>
                </div>
                <button className="text-[13px] text-[#2563EB] font-bold" onClick={() => navigate("/board")}>더보기</button>
              </div>
              <div className="flex flex-col gap-3">
                {postsLoading ? (
                  <div className="w-full h-[60px] bg-white rounded-[14px] animate-pulse" />
                ) : postsList.slice(0, 3).map((p: any) => (
                  <div key={p.postId} onClick={() => navigate(`/board/${p.postId}`)} className="cursor-pointer">
                    <PostPreviewCard title={p.title} likeCount={p.likeCount} commentCount={p.commentCount} date={formatRelativeTime(p.createdAt)} author={p.author?.nickname || p.author} />
                  </div>
                ))}
              </div>
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
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1"><Member className="size-[13px]" /> {members}/{maxMembers}</span>
        <span className="flex items-center gap-1"><Time className="size-[13px]" /> {time}</span>
      </div>
    </div>
  </div>
);

interface AIProjectCardProps {
  title: string;
  matchingScore: number;
  aiComment: string;
  onClick: () => void;
}

const AIProjectCard: React.FC<AIProjectCardProps> = ({ title, matchingScore, aiComment, onClick }) => (
  <div onClick={onClick} className="rounded-[20px] border border-[#F5E6FF] bg-gradient-to-b from-white to-[#FDF4FF] p-[20px] shadow-md active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden">
    <div className="absolute top-4 right-4 bg-[#F5F3FF] border border-[#DDD6FE] text-[#7C3AED] font-extrabold text-[12px] px-2.5 py-1 rounded-full">
      적합도 {matchingScore}%
    </div>
    
    <h3 className="text-[16px] font-extrabold text-[#1E293B] w-[70%] truncate mb-3.5">{title}</h3>
    
    <div className="bg-[#FAF5FF] rounded-[12px] p-3 border border-[#F3E8FF]">
      <p className="text-[12.5px] leading-[1.5] text-[#6B21A8] font-medium break-keep">
        🤖 {aiComment}
      </p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400 text-sm">
    일치하는 검색 결과가 없습니다.
  </div>
);

export default Home;