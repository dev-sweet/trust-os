import { getLinkInfo } from "@/services/review.services";
import { useQuery } from "@tanstack/react-query";

export const useGetLinkInfo = (uuid: string) => {
  return useQuery({
    queryKey: ["link"],
    queryFn: () => getLinkInfo(uuid),
    enabled: !!uuid,
  });
};
