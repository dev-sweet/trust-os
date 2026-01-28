import api from "../utils/axios";

export const requestOTP = async (data: { uuid: string }) => {
  const res = await api.post("/api/auth/request-otp", data);
  console.log(res);
  return res.data;
};

export const verifyOTP = async (data: { uuid: string; code: string }) => {
  const res = await api.post("/api/auth/verify-otp", data);
  return res.data;
};
