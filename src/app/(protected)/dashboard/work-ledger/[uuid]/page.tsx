'use client'
import { useGetOrderDetails } from "@/hooks/useOrderMutations";
import api from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useParams  } from "next/navigation";
import { 
  Calendar, 
  User, 
  MapPin, 
  Package, 
  FileText, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  ShieldBan,
  Hand,
  AlertTriangle,
  Upload,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCreateDispute } from "@/hooks/useDisputeMutaion";
import Link from "next/link";


const OrderDetails = () => {
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
   const {uuid} = useParams();
   const {data,isLoading} = useGetOrderDetails(uuid as string)
   const isCompleted = data?.sellerReviews?.review === "COMPLETED_AS_AGREED";
   const isIssueWithCompleted = data?.sellerReviews?.review === "COMPLETED_WITH_ISSUE";
   const sellerReviewId = data?.sellerReviews?.id;
   const {mutate} = useCreateDispute()
  const [formData, setFormData] = useState({
    issue: "",
    description: "",
    disputeFile: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = new FormData();
    payload.append("sellerReviewId",sellerReviewId);
    payload.append("issue", formData.issue);
    payload.append("description", formData.description);
    if (formData.disputeFile) {
      payload.append("disputeFile", formData.disputeFile);
    }

    mutate(payload);
  
  };
  if(isLoading) return <h1>Loading</h1>
  return (
    <div>
     <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header / Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard/work-ledger" className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Verified Transaction
          </div>
        </div>

        {/* Status Banner */}
        <div className={cn("rounded-xl p-4 border flex items-center justify-between",
          isCompleted ? "bg-emerald-50 border-emerald-100" :
          isIssueWithCompleted ?  "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100")}>
          <div className="flex items-center gap-3">
            {isCompleted ? (
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            ) : isIssueWithCompleted ?(
              <AlertCircle className="h-6 w-6 text-amber-600" />
            ): <ShieldBan className="h-6 w-6 text-red-600" />}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Review Status</p>
              <p className={cn('font-bold', isCompleted ? "text-emerald-700" :isIssueWithCompleted ? "text-amber-700" : "text-red-700")}>
                {data?.sellerReviews?.review.replace(/_/g, " ")}
              </p>
            </div>
          </div>
         {!isCompleted && <Button onClick={()=> setIsDisputeOpen(true)} className={cn("border-slate-200 font-bold text-gray-100 cursor-pointer", isIssueWithCompleted ? "bg-amber-600 hover:bg-amber-500" : "bg-red-600 hover:bg-red-500")} size="sm">
         {/* <MessagesSquare className="h-4 w-4 mr-2" /> */}
         <Hand />
           Raise Dispute
          </Button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Content: Order & Review */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-slate-400" />
                  Product Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{data.productName}</h2>
                    <p className="text-slate-500 text-sm mt-1">{data.productDescription}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Total Value</p>
                    <p className="text-xl font-bold text-emerald-600">${data.productPrice * data.productQuantity}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Unit Price</p>
                    <p className="font-medium text-slate-700">${data.productPrice}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Quantity</p>
                    <p className="font-medium text-slate-700">{data.productQuantity} Units</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-50">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                  <FileText className="h-5 w-5 text-slate-400" />
                  Seller&apos;s Review & Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="bg-slate-50 rounded-lg p-4 italic text-slate-600 text-sm leading-relaxed border border-slate-100">
                  {data?.sellerReviews?.complain || "No additional feedback provided."}
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  Review submitted on {new Date(data?.sellerReviews?.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Customer & Logistics */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <div className="h-1 bg-emerald-500" />
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">Customer Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg"><User className="h-4 w-4 text-slate-600" /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{data.customerName}</p>
                    <p className="text-xs text-slate-500">{data.customerPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg"><MapPin className="h-4 w-4 text-slate-600" /></div>
                  <p className="text-xs text-slate-600 leading-tight">{data.customerAddress}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Delivery Target</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium">{new Date(data.deliveryDate).toDateString()}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Link Expiry</p>
                  <div className="flex items-center gap-2 text-amber-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{new Date(data.linkExpiry).toLocaleDateString()}</span>
                  </div>
                </div>
                <button className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
                  Download Invoice <ExternalLink className="h-3 w-3" />
                </button>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>

<Dialog open={isDisputeOpen} onOpenChange={()=> setIsDisputeOpen(false)}>
      <DialogContent className="sm:max-w-[425px] h-auto p-0 overflow-hidden border-none shadow-2xl">
        {/* Visual Header */}
        <div className="bg-red-50 p-4 flex items-center gap-4">
          <div className="bg-white p-2.5 rounded-full shadow-sm">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Raise a Dispute
            </DialogTitle>
            <DialogDescription className="text-red-700/70 text-xs font-medium">
              Priority Review Case
            </DialogDescription>
          </div>
        </div>

        {/* Standard Tailwind Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Issue Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Dispute Subject
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Items not as described"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              value={formData.issue}
              onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
            />
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Detailed Description
            </label>
            <textarea
              required
              rows={4}
              placeholder="Please provide specific details about the issue..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* File Upload Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Upload Evidence
            </label>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-100 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
              <Upload className="h-5 w-5 text-slate-400 mb-1" />
              <span className="text-[11px] text-slate-500 px-2 text-center truncate w-full">
                {formData.disputeFile ? formData.disputeFile.name : "Click to upload proof (Image/PDF)"}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => setFormData({ ...formData, disputeFile: e.target.files?.[0] || null })}
              />
            </label>
          </div>

          {/* Notice Box */}
          <div className="flex gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
            <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-800 leading-tight">
              By submitting, you agree to pause the review. Our mediation team will review your claim within 24 hours.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDisputeOpen(false)}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all shadow-md active:scale-[0.98]"
            >
              Raise Dispute
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </div>
  )
}

export default OrderDetails
