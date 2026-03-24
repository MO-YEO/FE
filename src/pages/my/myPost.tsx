import { useNavigate } from "react-router-dom";
import PostCard from "../../components/PostCard";
import backIcon from "../assets/back.svg";

export default function MyPostsPage() {
  const navigate = useNavigate();

  const posts = [
    {
      id: 1,
      title: "오늘 도서관가실분",
      content: "5시부터 같이 공부하고 밥도먹어요",
      author: "꿀벌",
      time: "14:31",
      likeCount: 1,
      commentCount: 2,
    },
    {
      id: 2,
      title: "오늘 도서관가실분",
      content:
        "5시부터 같이 공부하고 밥도먹어요 전체 목록에서 보이는 내용은 최대 두줄로 해요 그 이상은 잘리게 처리해주세요",
      author: "꿀벌",
      time: "14:31",
      likeCount: 0,
      commentCount: 2,
    },
    {
      id: 3,
      title: "오늘 도서관가실분",
      content: "좋아요가 없는 경우는 좋아요 생략, 댓글 없는 경우는 댓글 생략",
      author: "꿀벌",
      time: "14:31",
      likeCount: 1,
      commentCount: 0,
    },
    {
      id: 4,
      title: "오늘 도서관가실분",
      content: "5시부터 같이 공부하고 밥도먹어요",
      author: "꿀벌",
      time: "14:31",
      likeCount: 1,
      commentCount: 2,
    },
    {
      id: 5,
      title: "오늘 도서관가실분",
      content: "5시부터 같이 공부하고 밥도먹어요",
      author: "꿀벌",
      time: "14:31",
      likeCount: 1,
      commentCount: 2,
    },
  ];

  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] bg-[#F8FAFC]">
      <header className="border-b-[0.8px] border-[#E5E7EB] bg-white">
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

      <section className="flex flex-col gap-[12px] px-[16px] pb-[24px] pt-[16px]">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            content={post.content}
            author={post.author}
            time={post.time}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
          />
        ))}
      </section>
    </main>
  );
}