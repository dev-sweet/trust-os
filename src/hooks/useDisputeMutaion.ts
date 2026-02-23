import { createDispute } from "@/services/dispute.services"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useCreateDispute = () =>{
    return useMutation({
        mutationFn: createDispute,
        onSuccess: (data) => {
            toast.success("Dispute raised successfully! Our team will review it within 24 hours.");
        },
     
    })
}