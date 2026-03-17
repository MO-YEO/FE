import React from 'react';

const Board: React.FC = () => {
  const posts = [
    { id: 1, title: "오늘 도서관가실분", content: "5시부터 같이 공부하고 밥도먹어요", author: "꿀범", time: "14:31", likes: 1, comments: 2 },
    { id: 2, title: "쑤기님이랑 도서관가실분", content: "5시부터 같이 공부하고 밥도먹어요 전체 목록에서 보이는 내용은 최대 두줄로 해요 그 이상은 ...", author: "꿀범", time: "14:31", likes: 0, comments: 2 },
    { id: 3, title: "코드 리뷰좀...", content: 'System.out.println("Moyeo");', author: "꿀범", time: "14:31", likes: 1, comments: 2 },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] font-sans antialiased overflow-x-hidden p-6">
      
      <div className="w-[382px] h-[812px] bg-white rounded-[40px] shadow-2xl border border-[#E5E7EB] flex flex-col relative overflow-hidden">
        
        <header className="pt-[40px] px-[20px] bg-white shrink-0">
          <div className="flex justify-between items-center h-[48px]">
            <button className="w-[36px] h-[36px] flex items-center justify-start bg-transparent border-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" fill="none" viewBox="0 0 10 18">
                <path stroke="#2F6BFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 1 1 9l8 8"/>
              </svg>
            </button>
            
            <h1 className="text-[20px] font-bold text-[#1E293B] leading-[48px]">게시판</h1>
            <button className="w-[36px] h-[36px] flex items-center justify-end bg-transparent border-none transition-transform active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 36 36">
                <path fill="#2F6BFF" d="M0 10C0 4.477 4.477 0 10 0h16c5.523 0 10 4.477 10 10v16c0 5.523-4.477 10-10 10H10C4.477 36 0 31.523 0 26V10Z"/>
                <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12.167 18h11.666M18 12.166v11.667"/>
              </svg>
            </button>
          </div>

          {/* 검색바 */}
          <div className="mt-[16px] relative">
            <input 
              type="text" 
              placeholder="🔍 게시글 검색..." 
              className="w-full h-[48px] px-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[15px] text-sm focus:outline-none focus:border-[#2F6BFF] transition-colors"
            />
          </div>
        </header>

        {/* 게시글 리스트 영역 */}
        <main className="flex-grow overflow-y-auto px-[20px] mt-[20px] pb-40 space-y-[12px] scrollbar-hide">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-[24px] p-[20px_16px] border border-[#F1F5F9] shadow-sm relative">
              
              {/* 스크랩 아이콘*/}
              <button className="absolute top-[20px] right-[16px] p-0 bg-transparent border-none outline-none focus:outline-none ring-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 12 12">
                  <path fill="#2F6BFF" stroke="#2F6BFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.667" d="m10.833 10.834-5-2.223-5 2.223v-8.89c0-.294.15-.577.419-.785a1.658 1.658 0 0 1 1.01-.326h7.143c.379 0 .742.118 1.01.326.268.208.418.49.418.786v8.889Z"/>
                </svg>
              </button>

              <div className="flex flex-col">
                <h3 className="text-[16px] font-bold text-[#1E293B] mb-1 pr-6 tracking-tight">{post.title}</h3>
                <span className="text-[11px] text-[#94A3B8] mb-3">{post.time}</span>
                <p className="text-[14px] text-[#475569] leading-relaxed line-clamp-2 mb-4 tracking-tight">
                  {post.content}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-50" />
                    <span className="text-[13px] font-medium text-[#64748B]">{post.author}</span>
                  </div>
                  
                  {/* 하트 & 댓글 섹션*/}
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-3 text-[11px] text-[#64748B] font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 11 11">
                        <path fill="#EF4400" d="M7.25 0C6.38 0 5.545.441 5 1.134 4.455.44 3.62 0 2.75 0 1.21 0 0 1.313 0 2.997c0 2.055 1.7 3.739 4.275 6.284L5 10l.725-.72C8.3 6.737 10 5.053 10 2.998 10 1.313 8.79 0 7.25 0Z"/>
                      </svg>
                      {post.likes}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#64748B] font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 11 11">
                        <path stroke="#9D9D9D" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3" d="M10.583 7.216a.923.923 0 0 1-.293.67 1.029 1.029 0 0 1-.707.278H2.997c-.265 0-.52.1-.707.278l-1.1 1.043a.373.373 0 0 1-.387.073.352.352 0 0 1-.16-.124.324.324 0 0 1-.06-.187V1.531c0-.251.106-.492.293-.67.188-.178.442-.278.707-.278h8c.265 0 .52.1.707.278a.923.923 0 0 1 .293.67v5.686Z"/>
                      </svg>
                      {post.comments}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </main>

   
      </div>

      <footer className="mt-6 text-[#6A7282] text-[12px] font-medium text-center opacity-60">
        © 2026 MO-YEO. All rights reserved.
      </footer>
    </div>
  );
};

export default Board;