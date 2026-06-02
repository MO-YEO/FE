import { useQuery } from "@tanstack/react-query";
import { queryFactory } from "./queryFactory";
import { recruitsApi } from "../../api/recruits";

function useGetRecruitsDetail(recruitId: number) {
  return useQuery({
    queryFn: async () => {
      const response = await recruitsApi.getRecruitDetail(recruitId);
      return response.recruit;
    },
    queryKey: queryFactory.recruits.detail(recruitId),
    retry: 1,
    staleTime: 1 * 60 * 1000, //1분: 모집글 업데이트를 위해 짧게 처리
    gcTime: 10 * 60 * 1000, //10분: 페이지 재방문시 빠른 화면을 보여주기 위해 10분 캐시 유지
  });
}

export default useGetRecruitsDetail;
