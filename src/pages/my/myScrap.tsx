import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import backIcon from "../../assets/back.svg";
import PostCard from "../../components/PostCard";
import { boardsApi } from "../../api/boards";

export default function MyScrap() {
  console.log("✅ MyScrap 페이지 렌더링됨");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: scrappedPosts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myScrappedPostsPage"],
    queryFn: async () => {
      console.log("📌 스크랩 목록 API 요청 시작");

      const data = await boardsApi.getScrappedPosts({
        page: 0,
        size: 20,
      });

      console.log("📌 스크랩 목록 API 응답:", data);

      return data;
    },
    retry: false,
  });

  const unbookmarkMutation = useMutation({
    mutationFn: async (postId: number) => {
      console.log("🚀 스크랩 취소 API 요청 시작:", postId);

      const data = await boardsApi.unbookmarkPost(postId);

      console.log("✅ 스크랩 취소 API 응답:", data);

      return data;
    },

    onSuccess: () => {
      console.log("✅ 스크랩 취소 성공 - 목록 다시 불러오기");

      queryClient.invalidateQueries({
        queryKey: ["myScrappedPostsPage"],
      });

      queryClient.invalidateQueries({
        queryKey: ["myPostsPage"],
      });

      queryClient.invalidateQueries({
        queryKey: ["myLikedPostsPage"],
      });
    },

    onError: (error) => {
      console.error("❌ 스크랩 취소 실패:", error);
      alert("스크랩 취소에 실패했습니다.");
    },
  });

  const formatDate = (date?: string) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleUnbookmark = (
    e: MouseEvent<HTMLButtonElement>,
    postId: number,
  ) => {
    console.log("🔥 handleUnbookmark 함수 들어옴:", postId);

    e.preventDefault();
    e.stopPropagation();

    console.log("🔥 preventDefault / stopPropagation 실행 완료");

    if (unbookmarkMutation.isPending) {
      console.log("⚠️ 이미 스크랩 취소 요청 중이라 중단");
      return;
    }

    console.log("🔥 스크랩 취소 mutate 실행:", postId);
    unbookmarkMutation.mutate(postId);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] bg-[#F8FAFC] pb-[88px]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="flex h-[96px] items-end px-[16px] pb-[20px] pt-[40px]">
          <button type="button" onClick={() => navigate(-1)}>
            <img src={backIcon} alt="뒤로가기" className="h-[24px] w-[24px]" />
          </button>

          <div className="flex flex-1 justify-center">
            <span className="text-[20px] font-bold leading-[28px] text-[#000000]">
              나의 스크랩
            </span>
          </div>

          <div className="h-[24px] w-[24px]" />
        </div>
      </header>

      <section className="px-[16px] pt-[16px]">
        {isLoading && (
          <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            스크랩한 항목을 불러오는 중입니다.
          </div>
        )}

        {isError && !isLoading && (
          <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#EF4444] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            스크랩한 항목을 불러오지 못했습니다.
          </div>
        )}

        {!isLoading && !isError && !scrappedPosts?.posts?.length && (
          <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[18px] text-center text-[14px] font-medium leading-[20px] text-[#64748B] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            스크랩한 항목이 없습니다.
          </div>
        )}

        {!isLoading && !isError && scrappedPosts?.posts?.length ? (
          <div className="flex flex-col gap-[12px]">
            {scrappedPosts.posts.map((post: any) => {
              console.log("🧾 스크랩 카드 렌더링:", post.postId, post.title);

              return (
                <PostCard
                  key={`post-${post.postId}`}
                  title={post.title}
                  content={post.content ?? ""}
                  author={post.author?.nickname ?? post.authorName ?? "작성자"}
                  time={formatDate(post.createdAt)}
                  likeCount={post.likeCount ?? 0}
                  commentCount={post.commentCount ?? 0}
                  isBookmarked={true}
                  onBookmarkClick={(e) => {
                    console.log("🔥 MyScrap에서 onBookmarkClick 받음:", post.postId);
                    handleUnbookmark(e, post.postId);
                  }}
                />
              );
            })}
          </div>
        ) : null}
      </section>
    </main>
  );
}