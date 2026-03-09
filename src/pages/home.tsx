import React from 'react';

// 1. 데이터 타입 정의
interface ProjectCardProps {
  title: string;
  author: string;
  members: number;
  time: string;
  tag: 'Backend' | 'Frontend' | 'ML Engineer' | 'Design';
}

interface PostItemProps {
  title: string;
  author: string;
  likes: number;
  comments?: number;
}

// 2. 하위 컴포넌트: 프로젝트 카드
const ProjectCard: React.FC<ProjectCardProps> = ({ title, author, members, time, tag }) => {
  const tagColor = {
    Backend: 'bg-blue-500',
    Frontend: 'bg-blue-400',
    'ML Engineer': 'bg-indigo-500',
    Design: 'bg-purple-400',
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-3 flex justify-between items-start">
      <div>
        <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
        <p className="text-xs text-gray-500 mb-2">작성자: {author}</p>
        <div className="flex items-center gap-3 text-gray-400 text-xs">
          <span>👥 {members}명</span>
          <span>🕒 {time}</span>
        </div>
      </div>
      <span className={`${tagColor[tag]} text-white text-[10px] px-2 py-1 rounded-lg font-bold`}>
        {tag}
      </span>
    </div>
  );
};

// 3. 메인 홈 컴포넌트
const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* Header Section */}
      <header className="bg-[#5C7CFF] pt-12 pb-10 px-6 rounded-b-[40px] shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-black tracking-tighter">MO-YEO</h1>
          <button className="text-white">🔔</button>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="프로젝트, 팀원 검색..." 
            className="w-full py-3 px-11 rounded-xl bg-white shadow-inner focus:outline-none text-sm"
          />
          <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
        </div>
      </header>

      {/* Service Shortcuts */}
      <section className="grid grid-cols-2 gap-4 px-5 -mt-6">
        <button className="bg-[#6B8BFF] p-5 rounded-3xl text-white shadow-xl flex flex-col items-start transition-transform active:scale-95">
          <div className="bg-white/20 p-2 rounded-lg mb-3">👥</div>
          <span className="font-bold text-sm">팀원 찾기</span>
          <span className="text-[10px] opacity-80">최적의 팀원 매칭</span>
        </button>
        <button className="bg-[#8EBAFF] p-5 rounded-3xl text-white shadow-xl flex flex-col items-start transition-transform active:scale-95">
          <div className="bg-white/20 p-2 rounded-lg mb-3">💬</div>
          <span className="font-bold text-sm">전체 게시판</span>
          <span className="text-[10px] opacity-80">정보 주고받기</span>
        </button>
      </section>

      {/* Recent Projects */}
      <section className="px-5 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">📈 최근 프로젝트</h2>
          <button className="text-xs text-blue-500">전체 →</button>
        </div>
        <ProjectCard title="2024 공모전 팀원 모집" author="김개발" members={5} time="2일 후" tag="Backend" />
        <ProjectCard title="졸업작품 프론트엔드 구인" author="이코딩" members={3} time="5일 후" tag="Frontend" />
        <ProjectCard title="AI 프로젝트 팀 빌딩" author="박머신" members={8} time="1주일 후" tag="ML Engineer" />
      </section>

      {/* Community Posts */}
      <section className="px-5 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">💬 최근 게시글</h2>
          <button className="text-xs text-blue-500">전체 →</button>
        </div>
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="p-3 border-b last:border-none flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-700">같이 시험공부 해요</p>
                <p className="text-[10px] text-gray-400">꿀범</p>
              </div>
              <div className="flex gap-2 text-[10px] text-gray-400">
                <span>❤️ {i + 1}</span>
                {i === 0 && <span>💬 2</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        {['홈', '팀원찾기', '프로젝트', '게시판', '마이'].map((menu, idx) => (
          <button key={menu} className={`flex flex-col items-center gap-1 ${idx === 0 ? 'text-blue-500' : 'text-gray-400'}`}>
            <span className="text-xl">{['🏠', '👥', '💼', '📋', '👤'][idx]}</span>
            <span className="text-[10px] font-medium">{menu}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Home;