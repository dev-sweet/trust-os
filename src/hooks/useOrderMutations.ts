import { useMutation, useQuery } from "@tanstack/react-query";
import { createOrder, getAllOrders, getOrderDetails } from "../services/order.services";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: createOrder,
  });
};


export const useGetAllOrders = (id: string) =>{
return useQuery({
  queryKey: ['orders'],
  queryFn: ()=> getAllOrders(id),
  enabled: !!id
})
}

export const useGetOrderDetails = (uuid:string) =>{
  return useQuery({
    queryKey:['orderDetails'],
    queryFn: () => getOrderDetails(uuid)
  })
}