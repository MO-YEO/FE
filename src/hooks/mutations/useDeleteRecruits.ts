import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryFactory } from "../queries/queryFactory";
import { recruitsApi } from "../../api/recruits";

export const useDeleteRecruits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recruitId: number) => recruitsApi.deleteRecruit(recruitId),
    onSuccess: () => {
      alert("프로젝트 삭제에 성공했습니다.");
      queryClient.invalidateQueries({
        queryKey: queryFactory.recruits.all,
      });
    },
    onError: () => {
      alert("프로젝트 삭제에 실패했습니다.");
    },
  });
};
