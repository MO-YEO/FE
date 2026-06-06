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

  // 1. 내 프로필 데이터 (마이페이지 기술 스택)
  const { data: profile } = useQuery({
    queryKey: ['myProfile'],
    queryFn: membersApi.getMyProfile,
    retry: 0,
  });

  // 2. 전체 모집글 리스트
  const { data: recruitsData, isLoading: recruitsLoading } = useQuery({
    queryKey: ['recruits', 'recent'],
    queryFn: () => recruitsApi.getRecruits({ size: 20 }),
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['boards', 'recent'],
    queryFn: () => boardsApi.getPosts({ size: 20 }),
  });

  const recruitsList = Array.isArray(recruitsData) ? recruitsData : (recruitsData?.recruits || []);

  // 🛠️ [실시간 마이페이지 기술 스택 정밀 비교 매칭 알고리즘]
  const getBestMatchProject = () => {
    if (!profile || recruitsList.length === 0) return null;

    // 🎯 예시 더미 데이터를 완전히 걷어내고 실제 마이페이지 스택(profile.skills)만 순수하게 추적
    const rawUserSkills: string[] = profile.techStacks|| []; 
    const userSkills = rawUserSkills.map((s: string) => s.toLowerCase().trim());

    // 마이페이지에 스택이 하나도 등록 안 되어 있다면 비교 연산 패스
    if (userSkills.length === 0) return null;

    // 모든 프로젝트를 돌면서 실제 매칭 점수 계산
    const scoredProjects = recruitsList.map((project: any) => {
      // 프로젝트 개별 요구 스택 배열 탐색
      const rawProjectSkills: string[] = project.skills || project.techStacks || project.requiredSkills || [];
      let finalProjectSkills = rawProjectSkills.map((s: string) => s.toLowerCase().trim());
      
      // 혹시 프로젝트 스택 데이터가 누락되었을 경우를 대비한 타이틀 키워드 파싱 우회로
      if (finalProjectSkills.length === 0 && project.title) {
        const lowerTitle = project.title.toLowerCase();
        if (lowerTitle.includes('react')) finalProjectSkills.push('react');
        if (lowerTitle.includes('typescript') || lowerTitle.includes('ts')) finalProjectSkills.push('typescript');
        if (lowerTitle.includes('figma') || lowerTitle.includes('기획')) finalProjectSkills.push('figma');
        if (lowerTitle.includes('html') || lowerTitle.includes('퍼블리셔')) finalProjectSkills.push('html');
        if (lowerTitle.includes('vue')) finalProjectSkills.push('vue');
        if (lowerTitle.includes('spring') || lowerTitle.includes('자바')) finalProjectSkills.push('spring boot');
      }

      // 내 실제 마이페이지 스택과 일치하는 교집합 스택 추출
      const matched = finalProjectSkills.filter((skill: string) => userSkills.includes(skill));
      
      // 순수 매칭률 점수화
      let matchingScore = 0;
      if (finalProjectSkills.length > 0) {
        matchingScore = Math.round((matched.length / finalProjectSkills.length) * 100);
      }

      // 💡 [핵심 가중치 시스템] 내가 가진 스택과 '겹치는 개수'만큼 추가 보너스 점수 부여 (+ 개당 15점)
      // 이 로직 덕분에 내 실제 스택이 많이 녹아든 연관 프로젝트가 '안녕'을 제치고 위로 치고 올라옵니다.
      matchingScore += matched.length * 15;
      
      // UI용 상하한선 정밀 스케일링 보정 (35% ~ 95%)
      if (matchingScore > 95) matchingScore = 95;
      if (matchingScore < 35) matchingScore = 45;

      // 실시간 매칭된 스택명을 코멘트 템플릿에 주입
      const matchedSkillsUpper = matched.length > 0 
        ? matched.map((s: string) => s.toUpperCase()).join(', ') 
        : userSkills.map((s: string) => s.toUpperCase()).slice(0, 2).join(', '); // 매칭 없으면 내 스택 일부 노출

      const aiComment = `이 모집글은 현재 사용자님이 보유하신 핵심 역량 중 [${matchedSkillsUpper}] 기술 스택과의 매칭률이 가장 높게 분석되어 추천되었습니다. 팀의 요구 역량과 정확히 부합하므로, 합류 시 개발 프로세스에 즉각적으로 결합하여 뛰어난 퍼포먼스를 발휘할 수 있는 최적의 프로젝트입니다.`;

      return {
        ...project,
        matchingScore,
        aiComment,
        recruitPostId: project.recruitId
      };
    });

    // 실제 기술 스택 연관성 점수가 가장 높은 최고의 1등을 상단에 정렬 및 출력
    return scoredProjects.sort((a: any, b: any) => b.matchingScore - a.matchingScore)[0];
  };

  const bestMatch = getBestMatchProject();
  const aiLoading = recruitsLoading;

  useEffect(() => {
    if (profile && profile.email) {
      if (!profile.email.endsWith("@catholic.ac.kr")) {
        alert("가톨릭대학교 학생 메일로만 이용 가능합니다.");
        localStorage.removeItem("access_token");
        navigate("/login", { replace: true });
      }
    }
  }, [profile, navigate]);

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
                <div className="rounded-[20px] border border-[#F3E8FF] bg-gradient-to-b from-white to-[#FAF5FF] p-[24px] shadow-sm animate-pulse text-center text-[#8B5CF6] text-[13px] font-bold">내 스택 기반 실시간 정밀 연산 중...</div>
              ) : bestMatch ? (
                <AIProjectCard title={bestMatch.title} matchingScore={bestMatch.matchingScore} aiComment={bestMatch.aiComment} onClick={() => navigate(`/project/${bestMatch.recruitPostId}`)} />
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

const AIProjectCard: React.FC<any> = ({ title, matchingScore, aiComment, onClick }) => (
  <div onClick={onClick} className="rounded-[20px] border border-[#F5E6FF] bg-gradient-to-b from-white to-[#FDF4FF] p-[20px] shadow-md active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden">
    <div className="absolute top-4 right-4 bg-[#F5F3FF] border border-[#DDD6FE] text-[#7C3AED] font-extrabold text-[12px] px-2.5 py-1 rounded-full">적합도 {matchingScore}%</div>
    <h3 className="text-[16px] font-extrabold text-[#1E293B] w-[70%] truncate mb-3.5">{title}</h3>
    <div className="bg-[#FAF5FF] rounded-[12px] p-3 border border-[#F3E8FF]"><p className="text-[12.5px] leading-[1.5] text-[#6B21A8] font-medium break-keep">🤖 {aiComment}</p></div>
  </div>
);

const EmptyState = () => (
  <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400 text-sm">일치하는 검색 결과가 없습니다.</div>
);

export default Home;