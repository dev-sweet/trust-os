import { OrderForm } from "../dashboard/create-order/page";
import api from "../utils/axios";

export const createOrder = async (data: OrderForm) => {
  const res = await api.post("/api/user/orders/create", data);
  return res.data;
};
