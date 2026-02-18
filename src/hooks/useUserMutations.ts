"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  checkUser,
  createUser,
  loginUser,
  LogoutUser,
  updateUserProfile,
} from "../services/user.services";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// login user
export const useLoginUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (data.success) {
        // setUser(data.user);
      }
    },
  });
};

// logout user
export const useLogoutUser = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: LogoutUser,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        router.push("/login");
      }
    },
    onError: (err) => {
      if (err) {
        console.log(err);
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
