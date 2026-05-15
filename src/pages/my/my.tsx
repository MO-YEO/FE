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
import { membersApi } from "../../api/member";
import { recruitsApi } from "../../api/recruits";
import { boardsApi } from "../../api/boards";
import { authApi } from "../../api/auth";
import type { UpdateMyProfileRequest } from "../../types";

type ProfileEditType = {
  name: string;
  role: string;
  email: string;
  bio: string;
  techStacks: string[];
  githubUrl: string;
};

type ProfileFormFromModal = {
  name: string;
  role: string;
  email: string;
  bio: string;
  techStacks: string[];
};

export default function MyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editableProfile, setEditableProfile] = useState<ProfileEditType>({
    name: "",
    role: "",
    email: "",
    bio: "",
    techStacks: [],
    githubUrl: "",
  });

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: membersApi.getMyProfile,
  });

  // 내가 작성한 모집글 목록
  const { data: myRecruits, isLoading: isRecruitsLoading } = useQuery({
    queryKey: ["myRecruits"],
    queryFn: () => recruitsApi.getMyRecruits({ page: 0, size: 5 }),
  });

  // 내가 지원한 모집글 목록
  const { data: appliedRecruits, isLoading: isAppliedRecruitsLoading } =
    useQuery({
      queryKey: ["appliedRecruits"],
      queryFn: () => recruitsApi.getAppliedRecruits({ page: 0, size: 5 }),
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

      setEditableProfile({
        name: updatedProfile.nickname ?? "",
        role: updatedProfile.role || "가톨릭대 재학생",
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

  const handleSaveProfile = async (updatedProfile: ProfileFormFromModal) => {
    const payload: UpdateMyProfileRequest = {
      nickname: updatedProfile.name,
      profileImageUrl: profile?.profileImageUrl ?? "https://example.com/profile.png",
      role: updatedProfile.role,
      contactEmail: updatedProfile.email,
      phoneNumber: profile?.phoneNumber ?? "010-0000-0000",
      githubUrl: editableProfile.githubUrl || profile?.githubUrl || "https://github.com/example",
      intro: updatedProfile.bio,
      techStacks: updatedProfile.techStacks,
      activityCategories: profile?.activityCategories?.length
        ? profile.activityCategories
        : ["프로젝트"],
    };

    console.log("프로필 수정 payload:", payload);

    try {
      const me = await membersApi.getMyProfile();
      console.log("수정 직전 내 프로필 조회 성공:", me);

      await updateProfileMutation.mutateAsync(payload);
    } catch (error) {
      console.error("프로필 수정 전/수정 중 에러:", error);
    }
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
                          <img src={mailIcon} alt="" className="h-[18px] w-[18px]" />
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
                  myRecruits.recruits.map((project) => (
                    <article
                      key={project.recruitId}
                      className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[14px] shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
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

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/projects/${project.recruitId}/applicants`)
                          }
                          className="text-right text-[12px] font-semibold leading-[20px] text-[#2563EB]"
                        >
                          {project.applicantCount}/{project.totalHeadcount} 지원자
                          확인하기
                        </button>
                      </div>

                      <div className="mt-[8px] text-[11px] leading-[16px] text-[#94A3B8]">
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
                {isAppliedRecruitsLoading ? (
                  <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[14px] text-center text-[13px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                    로딩 중...
                  </div>
                ) : appliedRecruits?.recruits?.length ? (
                  appliedRecruits.recruits.map((project) => (
                    <article
                      key={project.recruitId}
                      className="rounded-[14px] border border-[#E2E8F0] bg-white px-[20px] py-[18px] shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
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

                      <div className="mt-[14px] flex items-end justify-between gap-[12px]">
                        <div className="text-[12px] leading-[20px] text-[#64748B]">
                          지원 상태:{" "}
                          {getApplicationStatusText(project.applicationStatus)}
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate(`/projects/${project.recruitId}`)}
                          className="text-[12px] font-semibold leading-[20px] text-[#2563EB]"
                        >
                          상세보기 &gt;
                        </button>
                      </div>

                      <div className="mt-[8px] text-[11px] leading-[16px] text-[#94A3B8]">
                        마감일 {formatDate(project.deadline)}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[14px] text-center text-[13px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                    지원한 모집글이 없습니다.
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
                  myPosts.posts.map((post) => (
                    <div
                      key={post.postId}
                      onClick={() => navigate(`/board/${post.postId}`)}
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
    </>
  );
}