import bookmarkIcon from "../assets/bookmark.svg";
import commentIcon from "../assets/comment.svg";
import profileIcon from "../assets/profile.svg";

type PostCardProps = {
  title: string;
  content: string;
  author: string;
  time: string;
  commentCount: number;
};

export default function PostCard({
  title,
  content,
  author,
  time,
  commentCount,
}: PostCardProps) {
  return (
    <div
      className="
      w-full
      bg-white
      rounded-2xl
      shadow-sm
      border border-gray-100
      p-5
      "
    >
      {/* 제목 + 시간 + 북마크 */}
      <div className="flex justify-between items-start">
        <h3 className="text-[18px] font-semibold text-gray-900">{title}</h3>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{time}</span>

          <img
            src={bookmarkIcon}
            alt="bookmark"
            className="w-5 h-5"
          />
        </div>
      </div>

      {/* 내용 */}
      <p
        className="
        mt-3
        text-[15px]
        text-gray-600
        line-clamp-2
        "
      >
        {content}
      </p>

      {/* 작성자 + 댓글 */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <img
            src={profileIcon}
            alt="profile"
            className="w-7 h-7 rounded-full"
          />

          <span className="text-sm text-gray-500">{author}</span>
        </div>

        <div className="flex items-center gap-1 text-gray-400">
          <img
            src={commentIcon}
            alt="comment"
            className="w-5 h-5"
          />
          <span className="text-sm">{commentCount}</span>
        </div>
      </div>
    </div>
  );
}