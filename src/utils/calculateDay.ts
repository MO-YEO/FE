export const calculateDday = (deadline?: string) => {
  if (!deadline) return "D-?";

  const today = new Date();
  const endDate = new Date(deadline);

  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const diffTime = endDate.getTime() - today.getTime();
  const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDay > 0) return `D-${diffDay}`;
  if (diffDay === 0) return "D-DAY";
  return "마감";
};
