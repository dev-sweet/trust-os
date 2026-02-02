import { BusinessForm } from "../dashboard/business/create-business/page";
import api from "../utils/axios";

export const createBusinessProfile = async (data: BusinessForm) => {
  const res = await api.post("/api/user/business-profile/create", data);
  return res.data;
};
