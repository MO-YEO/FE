const ProjectPage = () => {
  const menu = ["전체", "수업", "프로젝트", "공모전", "스터디"];
  const tagMenu = ["전체", "기획", "개발", "디자인", "마케팅", "기타"];
  return (
    <div className="flex flex-col min-h-full">
      프로젝트페이지
      <div className="flex gap-2 bg-[#F9FAFB] px-4 py-2 border-b border-[#E5E7EB]">
        {menu.map((menu) => (
          <button key={menu} className="text-[#4A5565] text-[14px] font-bold">
            {menu}
          </button>
        ))}
      </div>
      <div className="flex gap-2 bg-[#F9FAFB] px-4 py-2 border-b border-[#E5E7EB]">
        {tagMenu.map((menu) => (
          <button
            key={menu}
            className="text-[12px] font-bold bg-white rounded-xl px-3 py-[6px] border-1 border-[#E5E7EB]"
          >
            {menu}
          </button>
        ))}
      </div>
      <div className="flex-1 px-5 py-4 bg-[#F9FAFB]">
        <div className="bg-white flex flex-col gap-2 p-4 rounded-lg shadow-sm border border-1 border-[#D0D0D0]">
          <div className="flex justify-between">
            <button className="text-[10px] text-[#2F6BFF] font-bold bg-[#EFF6FF] px-2 py-1 rounded-lg">
              공모전
            </button>
            <button className="text-[10px] text-[#EF4400] font-bold bg-[#FEF2F2] px-2 py-1 rounded-lg">
              D-709
            </button>
          </div>
          <p className="font-bold text-[16px]">
            부천시 영상 공모전 같이 하실 분
          </p>
          <p className="font-regular text-[14px]">
            저는 에펙 사용할 줄 알아요! 이왕이면 에펙 사용 가능 하신분을
            구합니다 입상을 목표로 열심히 해봐요
          </p>
          <div>
            <p className="text-[12px]">모집인원: 5명</p>
          </div>
          <div className="flex gap-2">
            <button className="text-[10px] text-[#0069A8] bg-[#F0F9FF] px-2 py-1 rounded-lg">
              python
            </button>
            <button className="text-[10px] text-[#0069A8] bg-[#F0F9FF] px-2 py-1 rounded-lg">
              fastApi
            </button>
          </div>
          <div className="border-t border-[#D0D0D0] flex justify-between">
            <div className="text-[#9D9D9D] text-[12px] py-2">
              <p>박머신</p>
              <p>미디어과</p>
            </div>
            <button>지원하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
