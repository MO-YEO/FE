import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryFactory } from "../queries/queryFactory";
import { recruitsApi } from "../../api/recruits";
import type { PatchRecruitParams } from "../../types";

type PatchRecruitMutationParams = {
  recruitId: number;
  payload: PatchRecruitParams;
};

export const usePatchRecruits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recruitId, payload }: PatchRecruitMutationParams) =>
      recruitsApi.patchRecruit(recruitId, payload),
    onSuccess: () => {
      alert("프로젝트 수정에 성공했습니다.");
      queryClient.invalidateQueries({
        queryKey: queryFactory.recruits.all,
      });
    },
    onError: () => {
      alert("프로젝트 삭제에 실패했습니다.");
    },
  });
};
