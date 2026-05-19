import closeIcon from "../assets/close.svg";

type BottomSheetProps = {
  open: boolean;
  title: string;
  sheetWidth: number;
  onClose: () => void;
  children: React.ReactNode;
};

export default function BottomSheet({
  open,
  title,
  sheetWidth,
  onClose,
  children,
}: BottomSheetProps) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        open
          ? "pointer-events-auto bg-black/50"
          : "pointer-events-none bg-black/0"
      }`}
      onClick={onClose}
    >
      <div
        className="fixed bottom-0 left-1/2 z-[60] overflow-hidden rounded-t-[20px] bg-white transition-transform duration-300"
        style={{
          width: `${sheetWidth}px`,
          transform: `translateX(-50%) translateY(${open ? "0" : "100%"})`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[68.8px] border-b border-[#E2E8F0] bg-white">
          <div className="flex h-full items-center justify-between px-5">
            <h2 className="text-[18px] font-bold text-[#111827]">{title}</h2>

            <button type="button" onClick={onClose}>
              <img src={closeIcon} alt="닫기" className="h-7 w-7" />
            </button>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
