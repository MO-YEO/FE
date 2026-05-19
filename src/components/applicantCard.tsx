type ApplicantCardProps = {
  name: string;
  role: string;
  intro: string;
  techStacks: string[];
  email: string;
  matchRate?: number;
  githubLabel?: string;
  reviewScore?: number;
  reviewCount?: number;
  reviews?: string[];
};

export default function ApplicantCard({
  name,
  role,
  intro,
  techStacks,
  email,
  githubLabel,
}: ApplicantCardProps) {
  const profileInitial = name.trim().charAt(0) || "?";

  return (
    <article className="rounded-[14px] border border-[#E2E8F0] bg-white px-[14px] py-[14px] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
      <div className="flex items-start gap-[12px]">
        <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-[14px] font-bold text-white">
          {profileInitial}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-[16px] font-bold leading-[22px] text-[#111827]">
            {name}
          </div>

          <div className="mt-[2px] text-[12px] leading-[18px] text-[#64748B]">
            {role}
          </div>
        </div>
      </div>

      <p className="mt-[12px] text-[14px] leading-[20px] text-[#475569]">
        {intro}
      </p>

      {techStacks.length > 0 && (
        <div className="mt-[12px] flex flex-wrap gap-[6px]">
          {techStacks.map((stack) => (
            <span
              key={stack}
              className="rounded-[8px] bg-[#EFF6FF] px-[8px] py-[4px] text-[11px] font-medium leading-[16px] text-[#2563EB]"
            >
              {stack}
            </span>
          ))}
        </div>
      )}

      <div className="mt-[12px] pr-[82px] text-[13px] leading-[20px] text-[#475569]">
        {email}
      </div>

      {githubLabel ? (
        <div className="mt-[8px] text-right">
          <button
            type="button"
            className="text-[12px] leading-[18px] text-[#64748B]"
          >
            {githubLabel}
          </button>
        </div>
      ) : null}
    </article>
  );
}