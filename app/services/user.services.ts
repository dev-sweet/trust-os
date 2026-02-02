import { User } from "../signup/page";
import api from "../utils/axios";

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await api.post(`/api/auth/login`, data);
  return res.data;
};

export const createUser = async (data: User) => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};

export const getUserProfile = async () => {
  const res = await api.get(`/api/user/my-profile`);
  return res.data;
};

export const updateUserProfile = async (data: any) => {
  const res = await api.patch("/api/user/my-profile", data);
  return res.data;
};
