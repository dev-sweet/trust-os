import { OrderForm } from "@/app/(protected)/dashboard/create-order/page";
import api from "../utils/axios";

export const createOrder = async ({
  id,
  data,
}: {
  id: string;
  data: OrderForm;
}) => {
  console.log("id", id);
  const res = await api.post(`/api/user/orders/create?businessId=${id}`, data);
  return res.data;
};
