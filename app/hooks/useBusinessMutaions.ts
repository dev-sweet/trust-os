import { useMutation } from "@tanstack/react-query";
import { createBusinessProfile } from "../services/business.services";

export const useCreateBusiness = () => {
  return useMutation({
    mutationFn: createBusinessProfile,
  });
};
