import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import PostPreviewCard from "../../components/PostPreviewCard";
import ProfileEditModal from "../../components/profileEditModal";
import { PATH } from "../../components/path";
import backIcon from "../../assets/back.svg";
import editIcon from "../../assets/edit.svg";
import mailIcon from "../../assets/mail.svg";
import projectIcon from "../../assets/project.svg";
import postIcon from "../../assets/post.svg";
import logoutIcon from "../../assets/logout.svg";
import chevronRightIcon from "../../assets/chevronRight.svg";
import closeIcon from "../../assets/close.svg";
import { membersApi } from "../../api/member";
import { recruitsApi } from "../../api/recruits";
import { boardsApi } from "../../api/boards";
import { authApi } from "../../api/auth";
import type { UpdateMyProfileRequest } from "../../types";

type InterestCategory = "수업" | "프로젝트" | "스터디" | "공모전";

const interestCategoryToApiValue: Record<InterestCategory, string> = {
  수업: "ACADEMIC",
  프로젝트: "PROJECT",
  스터디: "STUDY",
  공모전: "CONTEST",
};

const apiValueToInterestCategory: Record<string, InterestCategory> = {
  ACADEMIC: "수업",
  PROJECT: "프로젝트",
  STUDY: "스터디",
  CONTEST: "공모전",
};

type ProfileEditType = {
  name: string;
  role: string;
  activityCategories: InterestCategory[];
  email: string;
  bio: string;
  techStacks: string[];
  githubUrl: string;
};

type ProfileFormFromModal = {
  name: string;
  role: string;
  activityCategories: InterestCategory[];
  email: string;
  bio: string;
  techStacks: string[];
  githubUrl: string;
};

export default function MyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const [editableProfile, setEditableProfile] = useState<ProfileEditType>({
    name: "",
    role: "",
    activityCategories: [],
    email: "",
    bio: "",
    techStacks: [],
    githubUrl: "",
  });

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: membersApi.getMyProfile,
  });

  const { data: myRecruits, isLoading: isRecruitsLoading } = useQuery({
    queryKey: ["myRecruits"],
    queryFn: () => recruitsApi.getMyRecruits({ page: 0, size: 5 }),
  });

  const { data: appliedRecruits } = useQuery({
    queryKey: ["appliedRecruits"],
    queryFn: () => recruitsApi.getAppliedRecruits({ page: 0, size: 5 }),
  });

  const {
    data: participatingRecruits,
    isLoading: isParticipatingRecruitsLoading,
  } = useQuery({
    queryKey: ["participatingRecruits"],
    queryFn: () => recruitsApi.getParticipatingRecruits({ page: 0, size: 5 }),
  });

  const { data: myPosts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["myPosts"],
    queryFn: () => boardsApi.getMyPosts({ page: 0, size: 5 }),
  });

  const { data: scrappedPosts } = useQuery({
    queryKey: ["myScrappedPosts"],
    queryFn: () => boardsApi.getScrappedPosts({ page: 0, size: 1 }),
    retry: false,
  });

  const { data: likedPosts } = useQuery({
    queryKey: ["myLikedPosts"],
    queryFn: () => boardsApi.getLikedPosts({ page: 0, size: 1 }),
    retry: false,
  });

  const updateProfileMutation = useMutation({
    mutationFn: membersApi.updateMyProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["myProfile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      queryClient.invalidateQueries({ queryKey: ["myRecruits"] });
      queryClient.invalidateQueries({ queryKey: ["participatingRecruits"] });

      setEditableProfile({
        name: updatedProfile.nickname ?? "",
        role: updatedProfile.role || "가톨릭대 재학생",
        activityCategories:
          updatedProfile.activityCategories
            ?.map((category: string) => apiValueToInterestCategory[category])
            .filter(Boolean) ?? [],
        email: updatedProfile.contactEmail || updatedProfile.email || "",
        bio: updatedProfile.intro || "",
        techStacks: updatedProfile.techStacks ?? [],
        githubUrl: updatedProfile.githubUrl ?? "",
      });

      setIsEditModalOpen(false);
    },
    onError: (error) => {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패했습니다.");
    },
  });

  const profileInitial =
    ((profile?.nickname ?? editableProfile.name)?.trim().charAt(0)) || "?";

  useEffect(() => {
    if (!profile) return;

    setEditableProfile({
      name: profile.nickname ?? "",
      role: profile.role || "가톨릭대 재학생",
      activityCategories:
        profile.activityCategories
          ?.map((category: string) => apiValueToInterestCategory[category])
          .filter(Boolean) ?? [],
      email: profile.contactEmail || profile.email || "",
      bio: profile.intro || "",
      techStacks: profile.techStacks ?? [],
      githubUrl: profile.githubUrl ?? "",
    });
  }, [profile]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("로그아웃 API 실패:", error);
    } finally {
      localStorage.removeItem("access_token");
      queryClient.clear();
      navigate("/login", { replace: true });
    }
  };

  const handleWithdraw = async () => {
    if (
      !window.confirm(
        "정말로 탈퇴하시겠습니까?\n작성하신 공고, 지원서 및 모든 데이터가 영구 삭제되며 복구할 수 없습니다.",
      )
    ) {
      return;
    }

    try {
      await authApi.withdrawAccount();
      alert("회원 탈퇴가 정상적으로 완료되었습니다.");
    } catch (error) {
      console.error("회원 탈퇴 API 실패:", error);
      alert("탈퇴 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      localStorage.removeItem("access_token");
      queryClient.clear();
      navigate("/login", { replace: true });
    }
  };

  const handleSaveProfile = async (updatedProfile: ProfileFormFromModal) => {
    const activityCategories = updatedProfile.activityCategories.map(
      (category) => interestCategoryToApiValue[category],
    );

    const payload: UpdateMyProfileRequest = {
      nickname: updatedProfile.name,
      profileImageUrl:
        profile?.profileImageUrl ?? "https://example.com/profile.png",
      role: updatedProfile.role,
      contactEmail: updatedProfile.email,
      phoneNumber: profile?.phoneNumber ?? "010-0000-0000",
      githubUrl: updatedProfile.githubUrl || "https://github.com/example",
      intro: updatedProfile.bio,
      techStacks: updatedProfile.techStacks,
      activityCategories,
    };

    try {
      await updateProfileMutation.mutateAsync(payload);
    } catch (error) {
      console.error("프로필 수정 중 에러:", error);
    }
  };

  const goBoardDetail = (postId?: number) => {
    if (!postId) return;
    navigate(`/board/${postId}`);
  };

  const goProjectDetail = (recruitId?: number) => {
    if (!recruitId) return;
    navigate(`/project/${recruitId}`);
  };

  const formatDate = (date?: string) => {
    if (!date) return "";
    return date.split("T")[0];
  };

  const getStatusText = (status?: string) => {
    if (status === "OPEN") return "모집중";
    if (status === "CLOSED") return "마감";
    return status || "상태 없음";
  };

  const getApplicationStatusText = (status?: string) => {
    if (status === "APPLIED") return "지원완료";
    if (status === "ACCEPTED") return "합격";
    if (status === "REJECTED") return "불합격";
    if (status === "CANCELED") return "지원취소";
    return status || "지원완료";
  };

  const getApprovedCount = (project: any) => {
    return (
      project.approvedCount ??
      project.acceptedCount ??
      project.currentHeadcount ??
      project.participantCount ??
      project.memberCount ??
      0
    );
  };

  const getTotalHeadcount = (project: any) => {
    return project.totalHeadcount ?? project.recruitCount ?? 0;
  };

  const stats = useMemo(
    () => [
      {
        label: "지원한\n프로젝트",
        value: appliedRecruits?.pageInfo?.totalElements || 0,
        path: PATH.MY_APPLIED_PROJECT,
      },
      {
        label: "스크랩",
        value: scrappedPosts?.pageInfo?.totalElements || 0,
        path: PATH.MY_SCRAP,
      },
      {
        label: "좋아요",
        value: likedPosts?.pageInfo?.totalElements || 0,
        path: PATH.MY_LIKE,
      },
    ],
    [appliedRecruits, scrappedPosts, likedPosts],
  );

  return (
    <>
      <main className="mx-auto min-h-screen w-full max-w-[430px] bg-[#F8FAFC] pb-[88px]">
        <header className="border-b border-[#E5E7EB] bg-white">
          <div className="flex h-[96px] items-end px-[16px] pb-[20px] pt-[40px]">
            <button type="button" onClick={() => navigate(-1)}>
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
            <section className="rounded-[14px] border border-[#E2E8F0] bg-white px-[20px] pb-[20px] pt-[20px] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
              {isProfileLoading ? (
                <div className="flex h-[120px] items-center justify-center text-[#94A3B8]">
                  프로필 로딩 중...
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-[12px]">
                    <div className="flex min-w-0 flex-1 items-start gap-[14px]">
                      {profile?.profileImageUrl ? (
                        <img
                          src={profile.profileImageUrl}
                          alt="프로필 이미지"
                          className="h-[80px] w-[80px] shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-[28px] font-bold text-white">
                          {profileInitial}
                        </div>
                      )}

                      <div className="min-w-0 flex-1 pt-[4px]">
                        <div className="text-[18px] font-bold leading-[26px] text-[#111827]">
                          {(profile?.nickname ?? editableProfile.name) ||
                            "사용자"}
                        </div>

                        <div className="mt-[6px] whitespace-pre-line text-[14px] leading-[20px] text-[#475569]">
                          {profile?.role ||
                            editableProfile.role ||
                            "가톨릭대 재학생"}
                        </div>

                        <div className="mt-[8px] flex items-center gap-[8px] text-[12px] leading-[18px] text-[#94A3B8]">
                          <img
                            src={mailIcon}
                            alt=""
                            className="h-[18px] w-[18px]"
                          />
                          <span className="truncate">
                            {profile?.contactEmail ||
                              profile?.email ||
                              editableProfile.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(true)}
                      className="mt-[6px] flex shrink-0 items-center gap-[6px] text-[12px] font-medium leading-[20px] text-[#2563EB]"
                    >
                      <span>수정하기</span>
                      <img src={editIcon} alt="" className="h-[18px] w-[18px]" />
                    </button>
                  </div>

                  <p className="mt-[20px] text-[14px] leading-[20px] text-[#45556C]">
                    {profile?.intro ||
                      editableProfile.bio ||
                      "등록된 자기소개가 없습니다."}
                  </p>

                  <div className="mt-[16px] flex flex-wrap gap-[10px]">
                    {(profile?.techStacks ?? editableProfile.techStacks ?? []).map(
                      (stack: string) => (
                        <span
                          key={stack}
                          className="rounded-[8px] bg-[#EFF6FF] px-[8px] py-[4px] text-[12px] font-medium leading-[16px] text-[#1447E6]"
                        >
                          {stack}
                        </span>
                      ),
                    )}
                  </div>
                </>
              )}
            </section>

            <section className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[18px] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
              <div className="grid grid-cols-3">
                {stats.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`flex min-h-[96px] flex-col items-center justify-center ${
                      index !== stats.length - 1
                        ? "border-r border-[#E2E8F0]"
                        : ""
                    }`}
                  >
                    <span className="h-[28px] text-[22px] font-bold leading-[28px] text-[#3B82F6]">
                      {item.value}
                    </span>

                    <span className="mt-[12px] h-[32px] whitespace-pre-line text-center text-[12px] leading-[16px] text-[#62748E]">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-[12px] flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <img src={projectIcon} alt="" className="h-[22px] w-[22px]" />
                  <h2 className="text-[16px] font-bold leading-[24px] text-[#111827]">
                    내가 모집한 모집글
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(PATH.MY_RECRUITED_PROJECTS)}
                  className="text-[12px] font-semibold leading-[20px] text-[#0EA5E9]"
                >
                  전체보기
                </button>
              </div>

              <div className="flex flex-col gap-[12px]">
                {isRecruitsLoading ? (
                  <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[14px] text-center text-[13px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                    로딩 중...
                  </div>
                ) : myRecruits?.recruits?.length ? (
                  myRecruits.recruits.map((project: any) => (
                    <article
                      key={project.recruitId}
                      role="button"
                      tabIndex={0}
                      onClick={() => goProjectDetail(project.recruitId)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          goProjectDetail(project.recruitId);
                        }
                      }}
                      className="cursor-pointer rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[14px] shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
                    >
                      <div className="flex items-start justify-between gap-[12px]">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-[15px] font-bold leading-[24px] text-[#1E293B]">
                            {project.title}
                          </h3>

                          <div className="mt-[8px] flex flex-wrap gap-[6px]">
                            {project.skills?.map((skill: string) => (
                              <span
                                key={skill}
                                className="rounded-[8px] bg-[#EFF6FF] px-[8px] py-[4px] text-[11px] font-medium leading-[14px] text-[#1447E6]"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-[14px] px-[14px] py-[6px] text-[12px] font-bold leading-[20px] text-white shadow-[0_2px_6px_rgba(29,155,240,0.25)] ${
                            project.status === "OPEN"
                              ? "bg-[#1D9BF0]"
                              : "bg-[#94A3B8]"
                          }`}
                        >
                          {getStatusText(project.status)}
                        </span>
                      </div>

                      <div className="mt-[14px] flex items-end justify-between gap-[12px]">
                        <div className="text-[12px] leading-[20px] text-[#62748E]">
                          {project.recruitCategory ||
                            project.activityCategory ||
                            project.category ||
                            "모집글"}
                        </div>

                        <div className="text-[12px] font-semibold leading-[20px] text-[#2563EB]">
                          {getApprovedCount(project)}/{getTotalHeadcount(project)} 참여
                        </div>
                      </div>

                      <div className="mt-[14px] text-[11px] leading-[16px] text-[#94A3B8]">
                        마감일 {formatDate(project.deadline)}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[14px] text-center text-[13px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                    작성한 모집글이 없습니다.
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="mb-[12px] flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <img src={projectIcon} alt="" className="h-[22px] w-[22px]" />
                  <h2 className="text-[16px] font-bold leading-[24px] text-[#111827]">
                    내가 참여한 프로젝트
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(PATH.MY_PARTICIPATED_PROJECTS)}
                  className="text-[12px] font-semibold leading-[20px] text-[#0EA5E9]"
                >
                  전체보기
                </button>
              </div>

              <div className="flex flex-col gap-[12px]">
                {isParticipatingRecruitsLoading ? (
                  <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[14px] text-center text-[13px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                    로딩 중...
                  </div>
                ) : participatingRecruits?.recruits?.length ? (
                  participatingRecruits.recruits.map((project: any) => (
                    <article
                      key={project.recruitId}
                      role="button"
                      tabIndex={0}
                      onClick={() => goProjectDetail(project.recruitId)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          goProjectDetail(project.recruitId);
                        }
                      }}
                      className="cursor-pointer rounded-[14px] border border-[#E2E8F0] bg-white px-[20px] py-[18px] shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
                    >
                      <div className="flex items-start justify-between gap-[12px]">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-[15px] font-bold leading-[24px] text-[#1E293B]">
                            {project.title}
                          </h3>

                          <div className="mt-[8px] flex flex-wrap gap-[6px]">
                            {project.skills?.map((skill: string) => (
                              <span
                                key={skill}
                                className="rounded-[8px] bg-[#EFF6FF] px-[8px] py-[4px] text-[11px] font-medium leading-[14px] text-[#1447E6]"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-[14px] px-[12px] py-[5px] text-[11px] font-bold leading-[18px] text-white ${
                            project.status === "OPEN"
                              ? "bg-[#1D9BF0]"
                              : "bg-[#94A3B8]"
                          }`}
                        >
                          {getStatusText(project.status)}
                        </span>
                      </div>

                      <div className="mt-[14px] flex items-center justify-between gap-[12px]">
                        <div className="text-[12px] leading-[20px] text-[#64748B]">
                          지원 상태:{" "}
                          {getApplicationStatusText(project.applicationStatus)}
                        </div>

                        <div className="text-[12px] font-semibold leading-[20px] text-[#2563EB]">
                          {getApprovedCount(project)}/{getTotalHeadcount(project)} 참여
                        </div>
                      </div>

                      <div className="mt-[14px] text-[11px] leading-[16px] text-[#94A3B8]">
                        마감일 {formatDate(project.deadline)}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[14px] text-center text-[13px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                    참여한 프로젝트가 없습니다.
                  </div>
                )}
              </div>
            </section>

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
                  onClick={() => navigate(PATH.MY_POSTS)}
                  className="text-[12px] font-semibold leading-[20px] text-[#0EA5E9]"
                >
                  전체보기
                </button>
              </div>

              <div className="flex flex-col gap-[12px]">
                {isPostsLoading ? (
                  <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[14px] text-center text-[13px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                    로딩 중...
                  </div>
                ) : myPosts?.posts?.length ? (
                  myPosts.posts.map((post: any) => (
                    <div
                      key={post.postId}
                      onClick={() => goBoardDetail(post.postId)}
                      className="cursor-pointer"
                    >
                      <PostPreviewCard
                        title={post.title}
                        likeCount={post.likeCount}
                        commentCount={post.commentCount}
                        date={new Date(post.createdAt).toLocaleDateString()}
                      />
                    </div>
                  ))
                ) : (
                  <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[14px] text-center text-[13px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                    작성한 게시물이 없습니다.
                  </div>
                )}
              </div>
            </section>

            <section className="overflow-hidden rounded-[14px] border border-[#E2E8F0] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
              <button
                type="button"
                onClick={() => setIsSupportOpen(!isSupportOpen)}
                className="flex h-[52px] w-full items-center justify-between bg-white px-[16px] text-left"
              >
                <div className="flex items-center gap-[10px]">
                  <img
                    src={mailIcon}
                    alt="고객센터"
                    className="h-[16px] w-[16px] shrink-0"
                  />
                  <span className="text-[14px] font-medium leading-[20px] text-[#1D293D]">
                    서비스 안내 및 문의
                  </span>
                </div>
                <img
                  src={chevronRightIcon}
                  alt=""
                  className={`h-[16px] w-[16px] shrink-0 transition-transform duration-200 ${
                    isSupportOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              {isSupportOpen && (
                <div className="flex flex-col gap-[14px] border-t border-[#F1F5F9] bg-[#FAFCFF] p-[16px] text-left text-[13px] leading-relaxed text-[#475569]">
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(true)}
                    className="flex h-[44px] w-full items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-white px-[14px]"
                  >
                    <span className="font-semibold text-[#1D293D]">
                      서비스 이용약관 및 개인정보 처리방침
                    </span>
                    <img
                      src={chevronRightIcon}
                      alt=""
                      className="h-[14px] w-[14px]"
                    />
                  </button>

                  <div className="border-t border-[#E2E8F0] pt-3">
                    <div className="mb-1 font-bold text-[#111827]">
                      불편 사항 및 건의 접수
                    </div>
                    <div>
                      이용 중 매칭 오류, 권한 문제, 기타 건의 사항이 있으실 경우
                      아래 관리자 메일로 직접 문의해 주시기 바랍니다.
                    </div>
                    <div className="mt-2 font-bold text-[#1D293D]">
                      관리자 이메일:{" "}
                      <span className="select-all font-semibold text-[#2563EB]">
                        process68@naver.com
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <button
              type="button"
              onClick={handleWithdraw}
              className="mt-[4px] flex h-[52px] w-full items-center justify-between rounded-[14px] border border-[#FEE2E2] bg-white px-[16px] text-left shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-[10px]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                </svg>
                <span className="text-[14px] font-medium leading-[20px] text-[#EF4444]">
                  회원 탈퇴
                </span>
              </div>
              <img
                src={chevronRightIcon}
                alt=""
                className="h-[16px] w-[16px] shrink-0"
              />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-[4px] flex h-[52px] w-full items-center justify-between rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] text-left shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-center gap-[10px]">
                <img
                  src={logoutIcon}
                  alt="로그아웃"
                  className="h-[16px] w-[16px] shrink-0"
                />

                <span className="text-[14px] font-medium leading-[20px] text-[#1D293D]">
                  로그아웃
                </span>
              </div>

              <img
                src={chevronRightIcon}
                alt=""
                className="h-[16px] w-[16px] shrink-0"
              />
            </button>
          </div>
        </section>
      </main>

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialProfile={editableProfile}
        onSave={handleSaveProfile}
      />

      {isTermsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[20px]">
          <div className="flex h-[80vh] w-full max-w-[380px] flex-col rounded-[24px] bg-white p-[24px] shadow-2xl">
            <div className="mb-[16px] flex shrink-0 items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#111827]">
                서비스 약관 및 방침
              </h2>
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(false)}
                className="p-1"
              >
                <img src={closeIcon} alt="닫기" className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-[4px] text-left text-[13px] leading-[22px] text-[#475569]">
              <div className="mb-6">
                <h3 className="mb-2 text-[15px] font-bold text-[#111827]">
                  1. 서비스 이용약관 (Terms of Service)
                </h3>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-[#1D293D]">
                      제1조 (목적)
                    </h4>
                    <p>
                      본 약관은 가톨릭대학교 학생 전용 팀 빌딩 플랫폼
                      '모여(MO-YEO)'(이하 '서비스')가 제공하는 인터넷 관련
                      서비스의 이용 조건 및 절차, 이용자와 관리자 간의 권리,
                      의무 및 책임 사항을 규정함을 목적으로 합니다.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#1D293D]">
                      제2조 (이용 자격 및 회원가입)
                    </h4>
                    <p>
                      본 서비스는 가톨릭대학교 재학생 및 휴학생의 학업적 협업을
                      지원하기 위한 폐쇄형 플랫폼입니다.
                    </p>
                    <p>
                      회원가입은 구글 OAuth 2.0 인증을 거친 후, 사용자의 이메일
                      도메인이 가톨릭대학교 공식 학생 메일 계정(@catholic.ac.kr)인
                      경우에만 승인 및 완료됩니다. 학교 도메인이 아닌 경우 이용
                      자격이 제한됩니다.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#1D293D]">
                      제3조 (이용자의 의무 및 커뮤니티 가이드라인)
                    </h4>
                    <p>
                      이용자는 플랫폼 내 게시판, 프로젝트 모집 공고, 댓글 등 모든
                      영역에서 타인을 비방, 비하, 모욕하거나 허위 사실을 유포하는
                      행위를 해서는 안 됩니다.
                    </p>
                    <p>
                      상호 리뷰 시스템 이용 시, 객관적이고 사실에 기반한 평가만을
                      작성해야 하며, 개인적인 감정이나 악의적인 목적으로 허위 평가를
                      기재해서는 안 됩니다.
                    </p>
                    <p>
                      서비스 내에서 광고, 홍보, 사기 행위 등 학업 및 팀 빌딩 목적에
                      부합하지 않는 활동을 금지합니다.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#1D293D]">
                      제4조 (이용 제한 및 계정 제재)
                    </h4>
                    <p>
                      제3조의 의무를 위반하여 타인에게 지속적인 피해를 주거나
                      커뮤니티의 건전한 생태계를 훼손한 유저에 대하여, 관리자는 사전
                      통보 후 또는 긴급할 경우 즉시 계정 정지 및 서비스 이용 제한
                      조치를 취할 수 있습니다.
                    </p>
                    <p>
                      무임승차 방지를 위한 상호 리뷰 누적 점수가 기준치 이하로
                      지속될 경우, 매칭 시스템 이용에 패널티가 부과될 수 있습니다.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#1D293D]">
                      제5조 (책임의 한계 및 면책 조항)
                    </h4>
                    <p>
                      본 서비스는 가톨릭대학교 학생 간의 원활한 팀원 매칭을 위한
                      정보 공유 환경만을 제공합니다.
                    </p>
                    <p>
                      팀 매칭 완료 이후 발생하는 팀원 간의 갈등, 프로젝트 참여도,
                      과제 결과물 및 학점 리스크 등 실제 수행 과정에서 발생하는 모든
                      문제에 대해 본 개발 팀 및 서비스 관리자는 어떠한 법적, 행정적
                      책임도 지지 않습니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-2 border-t border-[#E2E8F0] pt-4">
                <h3 className="mb-2 text-[15px] font-bold text-[#111827]">
                  2. 개인정보 처리방침 (Privacy Policy)
                </h3>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-[#1D293D]">
                      제1조 (수집하는 개인정보 항목)
                    </h4>
                    <p>
                      본 서비스는 회원가입 및 학생 인증, 원활한 서비스 제공을 위해
                      구글 소셜 로그인 연동 시 다음과 같은 최소한의 개인정보를
                      수집합니다.
                    </p>
                    <p className="font-medium text-[#111827]">
                      필수 수집 항목: 구글 계정 이메일 주소, 프로필 닉네임,
                      프로필 이미지 정보
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#1D293D]">
                      제2조 (개인정보의 수집 및 이용 목적)
                    </h4>
                    <p>
                      수집된 개인정보는 회원 관리, 서비스 기능 제공, 소통 및 민원
                      처리를 위해 사용됩니다.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#1D293D]">
                      제3조 (개인정보의 보유 및 이용 기간)
                    </h4>
                    <p>
                      이용자의 개인정보는 서비스 이용 회원 자격을 유지하는 기간 동안
                      보유 및 이용되며, 회원 탈퇴 또는 프로젝트 운영 종료 시
                      파기됩니다.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#1D293D]">
                      제4조 (개인정보의 제3자 제공에 관한 사항)
                    </h4>
                    <p>
                      본 서비스는 이용자의 사전 동의 없이 개인정보를 외부에 공개하거나
                      제3자에게 제공하지 않습니다. 다만, 관련 법령에 따른 요청이 있는
                      경우는 예외로 합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsTermsModalOpen(false)}
              className="mt-[20px] flex h-[48px] w-full shrink-0 items-center justify-center rounded-[14px] bg-[#2563EB] text-[14px] font-bold text-white transition-transform active:scale-[0.98]"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}