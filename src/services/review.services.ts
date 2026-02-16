import api from "@/utils/axios";

export const getLinkInfo = async (uuid: string) => {
  const res = await api.get(`/api/customer-review?orderUuid=${uuid}`);
  return res.data;
};
