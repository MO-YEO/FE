import bookmarkIcon from "../assets/bookmark.svg";
import bookmarkActiveIcon from "../assets/bookmark.svg"; // ✅ 파란 SVG
import commentIcon from "../assets/comment.svg";
import profileIcon from "../assets/profileImage.svg";
import heartIcon from "../assets/like.svg";

type PostCardProps = {
  title: string;
  content: string;
  author: string;
  time: string;
  likeCount: number;
  commentCount: number;
  isBookmarked?: boolean;
  onBookmarkClick?: (e: React.MouseEvent) => void;
};

export default function PostCard({
  title,
  content,
  author,
  time,
  likeCount,
  commentCount,
  isBookmarked,
  onBookmarkClick,
}: PostCardProps) {
  return (
    <div
      className="
        w-full
        rounded-[14px]
        border-[0.8px]
        border-[#E2E8F0]
        bg-white
        px-[16px]
        py-[24px]
        shadow-[0_1px_3px_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]
      "
    >
      {/* 제목 + 시간 + 북마크 */}
      <div className="flex items-start justify-between gap-[12px]">

        <h3 className="flex-1 text-[18px] font-semibold leading-[28px] text-[#111827]">
          {title}
        </h3>

        <div className="flex shrink-0 items-center gap-[6px]">

          <span className="text-[12px] font-normal leading-[20px] text-[#9CA3AF]">
            {time}
          </span>

          {/* 북마크 버튼 */}
          <button
            type="button"
            onClick={onBookmarkClick}
            className="p-1 transition-transform active:scale-90"
          >
            <img
              src={
                isBookmarked
                  ? bookmarkActiveIcon
                  : bookmarkIcon
              }
              alt="스크랩"
              className={`
                h-[18px]
                w-[18px]
                transition-all
                ${
                  isBookmarked
                    ? "opacity-100"
                    : "opacity-40 grayscale"
                }
              `}
            />
          </button>
        </div>
      </div>

      {/* 내용 */}
      <p className="mt-[4px] line-clamp-2 text-[15px] font-normal leading-[24px] text-[#6B7280]">
        {content}
      </p>

      {/* 작성자 + 좋아요/댓글 */}
      <div className="mt-[12px] flex items-center justify-between">

        {/* 작성자 */}
        <div className="flex items-center gap-[6px]">

          <img
            src={profileIcon}
            alt="프로필"
            className="h-[14px] w-[14px] rounded-full"
          />

          <span className="text-[12px] font-medium leading-[20px] text-[#4B5563]">
            {author}
          </span>
        </div>

        {/* 좋아요 + 댓글 */}
        <div className="flex items-center gap-[8px]">

          {/* 좋아요 */}
          <div className="flex items-center gap-[2px]">

            <img
              src={heartIcon}
              alt="좋아요"
              className="h-[14px] w-[14px]"
            />

            <span className="text-[12px] font-normal leading-[20px] text-[#9CA3AF]">
              {likeCount}
            </span>
          </div>

          {/* 댓글 */}
          <div className="flex items-center gap-[2px]">

            <img
              src={commentIcon}
              alt="댓글"
              className="h-[14px] w-[14px]"
            />

            <span className="text-[12px] font-normal leading-[20px] text-[#9CA3AF]">
              {commentCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}