import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PostPreviewCard from "../../components/PostPreviewCard";
import { PATH } from "../../components/path";
import backIcon from "../../assets/back.svg";
import editIcon from "../../assets/edit.svg";
import mailIcon from "../../assets/mail.svg";
import projectIcon from "../../assets/project.svg";
import postIcon from "../../assets/post.svg";
import logoutIcon from "../../assets/logout.svg";
import chevronRightIcon from "../../assets/chevronRight.svg";


// API 임포트
import { membersApi } from "../../api/member";
import { recruitsApi } from "../../api/recruits";
import { boardsApi } from "../../api/boards";

export default function MyPage() {
  const navigate = useNavigate();

  // 1. 프로필 데이터 조회
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: membersApi.getMyProfile
  });

  // 2. 내 모집글 (내가 만든 프로젝트)
  const { data: myRecruits, isLoading: isRecruitsLoading } = useQuery({
    queryKey: ['myRecruits'],
    queryFn: () => recruitsApi.getMyRecruits({ size: 5 })
  });

  // 3. 내가 쓴 커뮤니티 게시글
  const { data: myPosts, isLoading: isPostsLoading } = useQuery({
    queryKey: ['myPosts'],
    queryFn: () => boardsApi.getMyPosts({ size: 5 })
  });

  // 4. 통계 데이터 조회를 위한 추가 쿼리
  // 지원한 프로젝트 리스트
  // const { data: appliedProjects } = useQuery({
  //   queryKey: ['myAppliedProjects'],
  //   queryFn: () => recruitsApi.getAppliedRecruits({ size: 1 })
  // });

  // 스크랩한 게시글 리스트
  const { data: scrappedPosts } = useQuery({
    queryKey: ['myScrappedPosts'],
    queryFn: () => boardsApi.getScrappedPosts({ size: 1 })
  });

  // 좋아요한 게시글 리스트
  const { data: likedPosts } = useQuery({
    queryKey: ['myLikedPosts'],
    queryFn: () => boardsApi.getLikedPosts({ size: 1 })
  });

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = import.meta.env.VITE_API_BASE_URL + '/logout';
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] bg-[#F8FAFC] pb-[88px] font-sans text-left">
      {/* 헤더 */}
      <header className="border-b border-[#E5E7EB] bg-white sticky top-0 z-30">
        <div className="flex h-[96px] items-end px-[16px] pb-[20px] pt-[40px]">
          <button type="button" onClick={() => navigate(-1)}>
            <img src={backIcon} alt="뒤로가기" className="h-[24px] w-[24px]" />
          </button>
          <div className="flex flex-1 justify-center">
            <span className="text-[20px] font-bold leading-[28px] text-[#000000]">마이페이지</span>
          </div>
          <div className="h-[36px] w-[36px] shrink-0" />
        </div>
      </header>

      <section className="px-[16px] pt-[16px]">
        <div className="flex flex-col gap-[16px]">
          
          {/* 프로필 섹션 */}
          <section className="rounded-[14px] border border-[#E2E8F0] bg-white px-[20px] pb-[20px] pt-[20px] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            {isProfileLoading ? (
              <div className="flex justify-center items-center h-[120px] animate-pulse text-[#94A3B8]">프로필 로딩 중...</div>
            ) : profile && (
              <>
                <div className="flex items-start justify-between gap-[12px]">
                  <div className="flex min-w-0 flex-1 items-start gap-[14px]">
                    <div className="flex h-[80px] w-[80px] shrink-0 items-center justify-center bg-[#5C7CFF] rounded-full text-white font-bold text-2xl shadow-inner overflow-hidden">
                     
                    </div>
                    <div className="min-w-0 flex-1 pt-[4px]">
                      <div className="text-[18px] font-bold leading-[26px] text-[#111827]">{profile.nickname}</div>
                      <div className="mt-[6px] text-[14px] leading-[20px] text-[#475569]">{profile.role || "가톨릭대 재학생"}</div>
                      <div className="mt-[8px] flex items-center gap-[8px] text-[12px] text-[#94A3B8]">
                        <img src={mailIcon} alt="" className="h-[14px] w-[14px]" />
                        <span className="truncate">{profile.email}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => navigate('/members')} className="mt-[6px] flex shrink-0 items-center gap-[6px] text-[12px] font-medium text-[#2563EB]">
                    <span>수정하기</span>
                    <img src={editIcon} alt="" className="h-[18px] w-[18px]" />
                  </button>
                </div>
                <p className="mt-[20px] text-[14px] leading-[20px] text-[#45556C]">{profile.content || "등록된 자기소개가 없습니다."}</p>
                <div className="mt-[16px] flex flex-wrap gap-[10px]">
                  {profile.tags?.map((stack: string) => (
                    <span key={stack} className="rounded-[8px] bg-[#EFF6FF] px-[8px] py-[4px] text-[12px] font-medium text-[#1447E6]">
                      {stack}
                    </span>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* 활동 통계 섹션 (수정된 요구사항 반영) */}
          <section className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[18px] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            <div className="grid grid-cols-3">
              {/* 1. 지원한 프로젝트 */}
              <button 
                onClick={() => navigate(PATH.MY_APPLIED_PROJECT)} 
                className="flex min-h-[96px] flex-col items-center justify-center border-r border-[#E2E8F0] transition-colors active:bg-[#F8FAFC]"
              >
                {/* <span className="text-[22px] font-bold text-[#3B82F6]">
                  {appliedProjects?.pageInfo?.totalElements || 0}
                </span> */}
                <span className="mt-[12px] whitespace-pre-line text-center text-[12px] font-bold text-[#62748E]">
                  지원한{"\n"}프로젝트
                </span>
              </button>

              {/* 2. 스크랩 */}
              <button 
                onClick={() => navigate(PATH.MY_SCRAP)} 
                className="flex min-h-[96px] flex-col items-center justify-center border-r border-[#E2E8F0] transition-colors active:bg-[#F8FAFC]"
              >
                <span className="text-[22px] font-bold text-[#3B82F6]">
                  {scrappedPosts?.pageInfo?.totalElements || 0}
                </span>
                <span className="mt-[12px] text-center text-[12px] font-bold text-[#62748E]">
                  스크랩
                </span>
              </button>

              {/* 3. 좋아요 */}
              <button 
                onClick={() => navigate(PATH.MY_LIKE)}
                className="flex min-h-[96px] flex-col items-center justify-center transition-colors active:bg-[#F8FAFC]"
              >
                <span className="text-[22px] font-bold text-[#1447E6]">
                  {likedPosts?.pageInfo?.totalElements || 0}
                </span>
                <span className="mt-[12px] text-center text-[12px] font-bold text-[#62748E]">
                  좋아요
                </span>
              </button>
            </div>
          </section>

          {/* 내가 모집한 프로젝트 */}
          <section>
            <div className="mb-[12px] flex items-center justify-between px-1">
              <div className="flex items-center gap-[8px]">
                <img src={projectIcon} alt="" className="h-[22px] w-[22px]" />
                <h2 className="text-[16px] font-bold text-[#111827]">내가 모집한 프로젝트</h2>
              </div>
              <button className="text-[12px] font-semibold text-[#0EA5E9]">전체보기</button>
            </div>
            <div className="flex flex-col gap-[12px]">
              {isRecruitsLoading ? (
                <div className="py-4 text-center text-[13px] text-[#94A3B8]">로딩 중...</div>
              ) : myRecruits?.recruits?.map((project: any) => (
                <article key={project.recruitId} className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[14px] shadow-sm">
                  <div className="flex items-start justify-between gap-[12px]">
                    <h3 className="truncate text-[15px] font-bold text-[#1E293B]">{project.title}</h3>
                    <span className={`shrink-0 rounded-[14px] px-[14px] py-[6px] text-[12px] font-bold text-white ${project.status === 'OPEN' ? 'bg-[#1D9BF0]' : 'bg-[#94A3B8]'}`}>
                      {project.status === 'OPEN' ? '모집중' : '마감'}
                    </span>
                  </div>
                  <div className="mt-[14px] flex items-end justify-between">
                    <span className="text-[12px] text-[#62748E]">역할: {project.category || "개발"}</span>
                    <button onClick={() => navigate(`/projects/${project.recruitId}/applicants`)} className="text-[12px] font-semibold text-[#2563EB]">
                      {project.applicantCount}/{project.totalHeadcount} 지원자 확인하기
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 내가 참여한 프로젝트 */}
          <section>
            <div className="mb-[12px] flex items-center justify-between px-1">
              <div className="flex items-center gap-[8px]">
                <img src={projectIcon} alt="" className="h-[22px] w-[22px]" />
                <h2 className="text-[16px] font-bold text-[#111827]">내가 참여한 프로젝트</h2>
              </div>
              <button className="text-[12px] font-semibold text-[#0EA5E9]">전체보기</button>
            </div>
            <div className="flex flex-col gap-[12px]">
              <article className="rounded-[14px] border border-[#E2E8F0] bg-white px-[20px] py-[18px] shadow-sm text-left">
                <h3 className="truncate text-[15px] font-bold text-[#1E293B]">2026 ICT 공모전 팀원 모집</h3>
                <div className="mt-[18px] flex items-end justify-between">
                  <span className="text-[12px] text-[#64748B]">역할: Frontend</span>
                  <button className="text-[12px] font-semibold text-[#2563EB]">팀원 리뷰달기 &gt;</button>
                </div>
              </article>
            </div>
          </section>

          {/* 내가 작성한 게시물 */}
          <section>
            <div className="mb-[12px] flex items-center justify-between px-1">
              <div className="flex items-center gap-[8px]">
                <img src={postIcon} alt="" className="h-[22px] w-[22px]" />
                <h2 className="text-[16px] font-bold text-[#111827]">내가 작성한 게시물</h2>
              </div>
              <button onClick={() => navigate(PATH.MY_POSTS)} className="text-[12px] font-semibold text-[#0EA5E9]">전체보기</button>
            </div>
            <div className="flex flex-col gap-[12px]">
              {isPostsLoading ? (
                <div className="py-4 text-center text-[13px] text-[#94A3B8]">로딩 중...</div>
              ) : myPosts?.posts?.map((post: any) => (
                <div key={post.postId} onClick={() => navigate(`/board/${post.postId}`)} className="cursor-pointer">
                  <PostPreviewCard
                    title={post.title}
                    likeCount={post.likeCount}
                    commentCount={post.commentCount}
                    date={new Date(post.createdAt).toLocaleDateString()}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 하단 메뉴 버튼 (문의하기, 로그아웃) */}
          <div className="flex flex-col gap-[8px] mt-2">
            

            <button onClick={handleLogout} className="flex h-[52px] w-full items-center justify-between rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] shadow-sm hover:bg-red-50 transition-colors">
              <div className="flex items-center gap-[10px]">
                <img src={logoutIcon} alt="" className="h-[18px] w-[18px] opacity-70" />
                <span className="text-[14px] font-bold text-[#EF4444]">로그아웃</span>
              </div>
              <img src={chevronRightIcon} alt="" className="h-[16px] w-[16px] opacity-40" />
            </button>
          </div>

        </div>
      </section>
    </main>
  );
}