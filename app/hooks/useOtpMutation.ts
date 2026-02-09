import { useMutation } from "@tanstack/react-query";
import { requestOTP, verifyOTP } from "../services/otp.services";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useRequestOTP = () => {
  return useMutation({
    mutationFn: requestOTP,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "OTP Send to your email!");
      }
    },
  });
};

export const useVerifyOTP = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: verifyOTP,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Verify Success!");
        router.push("/complete-profile/personal-information");
      }
    },
  });
};
