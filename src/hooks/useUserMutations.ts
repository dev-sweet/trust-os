"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  checkUser,
  createUser,
  loginUser,
  updateUserProfile,
} from "../services/user.services";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

// login user
export const useLoginUser = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("user data", data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (data.success) {
        // setUser(data.user);
      }
    },
  });
};

// create user
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
  });
};

// get user info
export const useCheckUser = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: checkUser,
  });
};

export const useUpdateUser = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Profile Updated Successfull");
        router.push(`/dashboard`);
      }
    },
  });
};
