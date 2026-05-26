import { useState } from "react";
import { recruitsApi } from "../api/recruits";
import type { ApplyRequest } from "../types";

export const useRecruitActions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async (
    recruitId: number,
    finalData: ApplyRequest,
    onSuccess?: () => void,
  ) => {
    try {
      setIsLoading(true);
      await recruitsApi.apply(recruitId, finalData);
      onSuccess?.();
    } catch (error) {
      console.error("지원 실패", error);
      alert("지원에 실패했습니다. 입력 양식을 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async (recruitId: number, bookmarkedByMe: boolean) => {
    try {
      if (bookmarkedByMe) {
        await recruitsApi.cancelBookmark(recruitId);
      } else {
        await recruitsApi.bookmark(recruitId);
      }
      alert("북마크 완료!");
    } catch (error) {
      console.error("북마크 실패", error);
      alert("북마크에 실패했습니다.");
    }
  };

  return {
    handleApply,
    handleBookmark,
    isLoading,
  };
};
