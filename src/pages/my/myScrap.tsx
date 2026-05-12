import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import backIcon from "../../assets/back.svg";
import PostCard from "../../components/PostCard";
import { boardsApi } from "../../api/boards";

export default function MyScrap() {
  const navigate = useNavigate();

  const {
    data: scrappedPosts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myScrappedPostsPage"],
    queryFn: () => boardsApi.getScrappedPosts({ page: 0, size: 20 }),
    retry: false,
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
            {scrappedPosts.posts.map((post) => (
              <div
                key={`post-${post.postId}`}
                onClick={() => navigate(`/board/${post.postId}`)}
                className="cursor-pointer"
              >
                <PostCard
                  title={post.title}
                  content={post.content ?? ""}
                  author={post.author?.nickname ?? post.authorName ?? "작성자"}
                  time={formatDate(post.createdAt)}
                  likeCount={post.likeCount}
                  commentCount={post.commentCount}
                  isBookmarked={true}
                />
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}