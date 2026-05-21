import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// ⭕ 생 apiClient 대신 주소가 안전하게 정제된 boardsApi를 임포트합니다.
import { boardsApi } from '../../api/boards';
import backIcon from "../../assets/back.svg";
import likeIcon from "../../assets/like.svg";

/** --- Types --- */
interface PostDetail {
  postId: number; title: string; content: string; createdAt: string;
  author: { nickname: string }; likeCount: number; commentCount: number;
  mine: boolean; liked: boolean;
}

interface Comment {
  commentId: number; content: string; createdAt: string; mine: boolean;
  author: { memberId: number; nickname: string };
}

const BoardDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [commentContent, setCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentValue, setEditCommentValue] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const fetchData = async () => {
    if (!postId) return;
    try {
      setIsLoading(true);
      
      // ⭕ 생 apiClient 대신 정제된 boardsApi 메소드를 사용하여 가로챕니다!
      const [pData, cData] = await Promise.all([
        boardsApi.getPostDetail(postId),
        boardsApi.getComments(postId)
      ]);

      const postResult = pData?.result || pData;
      const commentResult = cData?.result || cData || [];

      setPost({ ...postResult, liked: postResult.liked ?? postResult.likedByMe ?? false });
      setComments(Array.isArray(commentResult) ? commentResult : []);
      setEditTitle(postResult.title);
      setEditContent(postResult.content);
    } catch (err) { 
      console.error("상세 데이터 로드 실패:", err); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleLikeToggle = async () => {
    if (!post || !postId) return;
    try {
      // ⭕ 정제된 좋이요 API 매칭
      const res = post.liked 
        ? await boardsApi.unlikePost(postId)
        : await boardsApi.likePost(postId);
      
      const result = res?.result || res;
      setPost(prev => prev ? { 
        ...prev, 
        liked: result.liked ?? result.likedByMe ?? !prev.liked,
        likeCount: result.likeCount ?? (prev.liked ? prev.likeCount - 1 : prev.likeCount + 1)
      } : prev);
    } catch (err) { alert("좋아요 처리 실패"); }
  };

  const handlePostAction = async (type: 'delete' | 'update') => {
    if (!postId) return;
    try {
      if (type === 'delete') {
        if (!window.confirm("삭제하시겠습니까?")) return;
        await boardsApi.deletePost(postId);
        navigate('/board');
      } else {
        await boardsApi.updatePost(postId, { title: editTitle, content: editContent, images: [] });
        setIsEditModalOpen(false);
        fetchData();
      }
    } catch (err) { alert("실패"); }
  };

  const handleCommentAction = async (type: 'add' | 'edit' | 'delete', cId?: number) => {
    try {
      if (type === 'add') {
        if (!commentContent.trim() || !postId) return;
        await boardsApi.createComment(postId, { content: commentContent });
        setCommentContent('');
      } else if (type === 'edit') {
        if (!cId) return;
        await boardsApi.updateComment(cId, { content: editCommentValue });
        setEditingCommentId(null);
      } else {
        if (!cId) return;
        if (!window.confirm("삭제하시겠습니까?")) return;
        await boardsApi.deleteComment(cId);
      }
      fetchData();
    } catch (err) { alert("실패"); }
  };

  if (isLoading) return <LoadingView />;
  if (!post) return <div className="p-10 text-center">글이 없습니다.</div>;

  return (
    <div className="flex justify-center bg-white min-h-screen">
      <main className="relative w-full max-w-[400px] bg-[#F8FAFC] pb-[100px] shadow-2xl">
        <header className="border-b border-[#E5E7EB] bg-white flex h-[96px] items-end px-[20px] pb-[20px] sticky top-0 z-40">
          <button onClick={() => navigate(-1)} className="p-1"><img src={backIcon} alt="뒤로" className="w-6 h-6" /></button>
          <div className="flex-1 text-center font-bold text-[18px]">상세보기</div>
          <button onClick={handleLikeToggle} className="flex items-center gap-1.5 active:scale-90 px-1">
            <span className={`text-[14px] font-bold ${post.liked ? 'text-[#EF4444]' : 'text-[#64748B]'}`}>{post.likeCount}</span>
            <img src={likeIcon} alt="좋아요" className={`w-[22px] h-[22px] transition-all ${post.liked ? "invert-[40%] sepia-[82%] saturate-[4127%] hue-rotate-[343deg] brightness-[96%] contrast-[95%]" : "opacity-30 grayscale"}`} />
          </button>
        </header>

        <section className="px-[20px] pt-[6px] text-left">
          <div className="bg-white rounded-[24px] p-7 shadow-sm border border-[#F1F5F9] mb-4">
            <div className="flex items-center justify-between mb-6">
              <UserChip nickname={post.author?.nickname} date={post.createdAt} />
              {post.mine && (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditModalOpen(true)} className="text-[13px] font-bold text-[#64748B]">수정</button>
                  <button onClick={() => handlePostAction('delete')} className="text-[13px] font-bold text-[#EF4444]">삭제</button>
                </div>
              )}
            </div>
            <h1 className="text-[22px] font-extrabold text-[#111827] mb-5 leading-snug">{post.title}</h1>
            <article className="text-[16px] leading-[1.8] text-[#334155] whitespace-pre-wrap mb-4">{post.content}</article>
          </div>

          <div className="bg-white rounded-[24px] px-6 py-2 shadow-sm border border-[#F1F5F9] mb-10">
            <h3 className="font-bold text-[16px] text-[#1E293B] mt-5 mb-2 px-1">댓글 {comments.length}</h3>
            <div className="flex flex-col">
              {comments.map((c) => (
                <CommentItem key={c.commentId} comment={c} isEditing={editingCommentId === c.commentId} editValue={editCommentValue} setEditValue={setEditCommentValue} onEditStart={() => { setEditingCommentId(c.commentId); setEditCommentValue(c.content); }} onEditCancel={() => setEditingCommentId(null)} onEditSave={() => handleCommentAction('edit', c.commentId)} onDelete={() => handleCommentAction('delete', c.commentId)} />
              ))}
            </div>
          </div>
        </section>

        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 flex h-16 w-full max-w-[400px] border-t border-black bg-[#FFFFFF] items-center px-[20px] z-50">
          <div className="flex w-full items-center gap-3">
            <input
              className="flex-1 h-[40px] bg-[#F1F5F9] rounded-full px-5 text-[14px] outline-none border border-transparent focus:bg-white focus:border-[#2563EB]/20 transition-all"
              placeholder="댓글을 작성해주세요"
              value={commentContent}
              onChange={e => setCommentContent(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCommentAction('add')}
            />
            <button
              onClick={() => handleCommentAction('add')}
              className="shrink-0 text-[#2563EB] font-bold text-[15px] px-1 active:scale-95 transition-transform"
            >
              등록
            </button>
          </div>
        </footer>

        {isEditModalOpen && (
          <EditModal title={editTitle} content={editContent} setTitle={setEditTitle} setContent={setEditContent} onCancel={() => setIsEditModalOpen(false)} onSave={() => handlePostAction('update')} />
        )}
      </main>
    </div>
  );
};

/** --- Helper Components --- */
const UserChip = ({ nickname, date }: any) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center font-bold text-[#2563EB]">{nickname?.[0] ?? "U"}</div>
    <div className="flex flex-col text-left">
      <span className="font-bold text-[15px]">{nickname ?? "익명 유저"}</span>
      <span className="text-[12px] text-[#94A3B8]">{new Date(date).toLocaleDateString()}</span>
    </div>
  </div>
);

const CommentItem = ({ comment, isEditing, editValue, setEditValue, onEditStart, onEditCancel, onEditSave, onDelete }: any) => (
  <div className="py-5 border-b border-[#F1F5F9] last:border-0 text-left">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className={`font-bold text-[14px] ${comment.mine ? 'text-[#2563EB]' : 'text-[#334155]'}`}>{comment.author?.nickname ?? "익명 댓글러"}</span>
        <span className="text-[11px] text-[#94A3B8]">{new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>
      {comment.mine && !isEditing && (
        <div className="flex gap-2 text-[11px] font-bold">
          <button onClick={onEditStart} className="text-[#64748B]">수정</button>
          <button onClick={onDelete} className="text-[#EF4444]">삭제</button>
        </div>
      )}
    </div>
    {isEditing ? (
      <div className="flex flex-col gap-2 mt-2">
        <textarea className="w-full p-3 bg-[#F1F5F9] rounded-xl text-[14px] outline-none border border-gray-200" value={editValue} onChange={e => setEditValue(e.target.value)} />
        <div className="flex justify-end gap-2 text-[12px] font-bold">
          <button onClick={onEditCancel} className="text-gray-400">취소</button>
          <button onClick={onEditSave} className="text-[#2563EB]">저장</button>
        </div>
      </div>
    ) : <p className="text-[14px] text-[#475569] leading-relaxed">{comment.content}</p>}
  </div>
);

const EditModal = ({ title, content, setTitle, setContent, onCancel, onSave }: any) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-5">
    <div className="w-full max-w-[360px] bg-white rounded-[24px] p-7 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onCancel} className="text-gray-400">취소</button>
        <h2 className="font-bold text-[18px]">글 수정</h2>
        <button onClick={onSave} className="text-[#2563EB] font-bold">완료</button>
      </div>
      <input className="w-full text-[18px] font-bold border-b border-gray-100 pb-3 mb-4 outline-none" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea className="w-full h-[280px] text-[16px] leading-relaxed outline-none resize-none" value={content} onChange={e => setContent(e.target.value)} />
    </div>
  </div>
);

const LoadingView = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
    <div className="text-[#2563EB] font-bold animate-pulse">데이터를 불러오는 중...</div>
  </div>
);

export default BoardDetailPage;