import { useNavigate } from "react-router-dom";
import backIcon from "../../assets/back.svg";

export default function MyLike() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] bg-[#F8FAFC] pb-[88px]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="flex h-[96px] items-end px-[16px] pb-[20px] pt-[40px]">
          <button type="button" onClick={() => navigate(-1)}>
            <img src={backIcon} alt="뒤로가기" className="h-[24px] w-[24px]" />
          </button>

          <div className="flex flex-1 justify-center">
            <span className="text-[20px] font-bold leading-[28px] text-[#000000]">
              나의 좋아요
            </span>
          </div>

          <div className="h-[24px] w-[24px]" />
        </div>
      </header>

      <section className="px-[16px] pt-[16px]">
        <div className="flex flex-col gap-[12px]">
          <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-[16px] py-[18px] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            <p className="text-[14px] font-medium leading-[20px] text-[#64748B]">
              좋아요한 게시글 카드가 여기에 들어올 예정
            </p>
          </div>

          <div className="h-[90px] rounded-[14px] border border-[#E2E8F0] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06)]" />
          <div className="h-[90px] rounded-[14px] border border-[#E2E8F0] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06)]" />
          <div className="h-[90px] rounded-[14px] border border-[#E2E8F0] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06)]" />
        </div>
      </section>
    </main>
  );
}


