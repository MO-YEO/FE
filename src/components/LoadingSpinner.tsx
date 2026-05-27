type loadingSpinnerProps = {
  text?: string;
};
export const LoadingSpinner = ({ text }: loadingSpinnerProps) => {
  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      <div
        className="size-12 animate-spin rounded-full border-6
            border-t-transparent border-[#356AE6]"
        role="status"
      >
        <span className="sr-only">로딩중...</span>
      </div>
      <p>{text}</p>
    </div>
  );
};
