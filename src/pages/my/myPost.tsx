import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../../components/PostCard";
import backIcon from "../../assets/back.svg";
import { boardsApi } from "../../api/boards";

export default function MyPostsPage() {
  const navigate = useNavigate();

  const {
    data: myPosts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myPostsPage"],
    queryFn: () => boardsApi.getMyPosts({ page: 0, size: 20 }),
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
    <main className="mx-auto min-h-screen w-full max-w-[430px] bg-[#F8FAFC] pb-[90px]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="flex h-[96px] items-end px-[16px] pb-[20px] pt-[40px]">
          <button type="button" onClick={() => navigate(-1)}>
            <img src={backIcon} alt="뒤로가기" className="h-[24px] w-[24px]" />
          </button>

          <div className="flex flex-1 justify-center">
            <span className="text-[20px] font-bold leading-[28px] text-[#000000]">
              내가 작성한 게시물
            </span>
          </div>

          <div className="h-[24px] w-[24px]" />
        </div>
      </header>

      <section className="px-[16px] py-[16px]">
        {isLoading && (
          <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            게시물을 불러오는 중입니다.
          </div>
        )}

        {isError && !isLoading && (
          <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#EF4444] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            게시물을 불러오지 못했습니다.
          </div>
        )}

        {!isLoading && !isError && !myPosts?.posts?.length && (
          <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[32px] text-center text-[14px] text-[#94A3B8] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            작성한 게시물이 없습니다.
          </div>
        )}

        {!isLoading && !isError && myPosts?.posts?.length ? (
          <div className="flex flex-col gap-[12px]">
            {myPosts.posts.map((post) => (
              <div
                key={post.postId}
                onClick={() => navigate(`/board/${post.postId}`)}
                className="cursor-pointer"
              >
                <PostCard
                  title={post.title}
                  content={post.content ?? ""}
                  author={post.authorName ?? post.author?.nickname ?? "작성자"}
                  time={formatDate(post.createdAt)}
                  likeCount={post.likeCount}
                  commentCount={post.commentCount}
                />
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}