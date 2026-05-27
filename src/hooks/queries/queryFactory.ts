export const queryFactory = {
  recruits: {
    all: ["recruits"] as const,
    lists: () => [...queryFactory.recruits.all, "list"],
    list: (params?: {
      activityCategory?: string;
      recruitCategory?: string;
      keyword?: string;
      sort?: string;
    }) => [...queryFactory.recruits.lists(), params] as const,
    detail: (recruitId: number) => [
      ...queryFactory.recruits.all,
      { recruitId },
    ],
  },
};
