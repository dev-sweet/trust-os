import api from "@/utils/axios";

export const getLinkInfo = async (uuid: string) => {
  const res = await api.get(`/api/customer-review?orderUuid=${uuid}`);
  return res.data;
};

export const submitReview = async (data: FormData) => {
  const res = await api.post("/api/customer-review", data);
  return res.data;
};
