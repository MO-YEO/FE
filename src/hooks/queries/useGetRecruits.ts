import { useQuery } from "@tanstack/react-query";
import { queryFactory } from "./queryFactory";
import { recruitsApi } from "../../api/recruits";

type RecruitSearchParams = {
  activityCategory?: string;
  recruitCategory?: string;
  keyword?: string;
  sort?: string;
};
function useGetRecruits({
  activityCategory,
  recruitCategory,
  keyword,
  sort,
}: RecruitSearchParams) {
  return useQuery({
    queryFn: () =>
      recruitsApi.getRecruits({
        activityCategory,
        recruitCategory,
        keyword,
        sort,
      }),
    queryKey: queryFactory.recruits.list({
      activityCategory,
      recruitCategory,
      keyword,
      sort,
    }),
    retry: 1,
    staleTime: 30 * 1000, //30초: 모집글 업데이트를 위해 짧게 처리
    gcTime: 10 * 60 * 1000, //10분: 페이지 재방문시 빠른 화면을 보여주기 위해 10분 캐시 유지
  });
}

export default useGetRecruits;
