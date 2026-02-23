import { OrderForm } from "@/app/(protected)/dashboard/create-order/page";
import api from "../utils/axios";

export const createOrder = async ({
  id,
  data,
}: {
  id: string;
  data: OrderForm;
}) => {
  const res = await api.post(`/api/user/orders/create?businessId=${id}`, data);
  return res.data;
};


export const getAllOrders = async (id:string) =>{
  const res = await api.get(`/api/user/orders?businessId=${id}`);
  return res.data
}

export const getOrderDetails = async(uuid:string) =>{
  const res = await api.get(`/api/user/orders/details?uuid=${uuid}`);
  return res.data
}