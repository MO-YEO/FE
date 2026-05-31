import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recruitsApi } from "../../api/recruits";
import { queryFactory } from "../queries/queryFactory";

export const useBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recruitId,
      bookmarkedByMe,
    }: {
      recruitId: number;
      bookmarkedByMe: boolean;
    }) => {
      if (bookmarkedByMe) {
        return recruitsApi.cancelBookmark(recruitId);
      }
      return recruitsApi.bookmark(recruitId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryFactory.recruits.all,
      });
    },

    onError: () => {
      alert("북마크에 실패했습니다.");
    },
  });
};
