"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  getUserProfile,
  loginUser,
} from "../services/user.services";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (data.success) {
        toast.success(data.message || "Login successful");
        if (data?.user?.isEmailVerified) {
          router.push("/dashboard");
        } else {
          router.push(`/signup/verify-otp?uuid=${data?.user.uuid}`);
        }
      }
    },
  });
};

export const useCreateUser = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Registration Successfull");
        router.push(`/signup/verify-otp?uuid=${data.data.uuid}`);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useGetUserProfile = () => {
  return useMutation({
    mutationFn: getUserProfile,
    onSuccess: (data) => {
      console.log(data);
    },
  });
};
