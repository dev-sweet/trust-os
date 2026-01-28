import { useMutation } from "@tanstack/react-query";
import { requestOTP, verifyOTP } from "../services/otp.services";
import toast from "react-hot-toast";

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
  return useMutation({
    mutationFn: verifyOTP,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Verify Success!");
      }
    },
  });
};
