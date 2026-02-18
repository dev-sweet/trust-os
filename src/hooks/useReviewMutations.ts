import { getLinkInfo, submitReview } from "@/services/review.services";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetLinkInfo = (uuid: string) => {
  return useQuery({
    queryKey: ["link"],
    queryFn: () => getLinkInfo(uuid),
    enabled: !!uuid,
  });
};

export const useSubmitReview = () => {
  return useMutation({
    mutationFn: submitReview,
    onSuccess: (data) => {
      if (data) {
        toast.success(
          "Your review submitted successfully! Thanks for share your review",
        );
      }
    },
    onError: (error) => {
      console.log("error", error);
    },
  });
};
