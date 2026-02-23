import api from "@/utils/axios";

export const createDispute = async (data:FormData) => {
  const res = await api.post("/api/user/dispute", data);
  return res.data;
}