"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  User,
  Package,
  ChevronRight,
  CheckCircle,
  Phone,
  Truck,
  TriangleAlert,
  Clock,
  ShieldBan,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WorkLedger } from "@/app/(protected)/dashboard/work-ledger/page";
import { cn } from "@/lib/utils";

export default function WorkEventCard({order}:{order:WorkLedger}) {
  // console.log(order)
 const {customerName,customerPhone,deliveryDate,invoiceNumber,productName,sellerReviews,uuid}  = order

  const isCompleted = sellerReviews?.review === "COMPLETED_AS_AGREED";
   const isNotCompleted = sellerReviews?.review === "NOT_COMPLETED";
  return (
    <div className={cn("p-3 sm:p-4 transition-all hover:shadow-sm w-full rounded-lg", isCompleted ? "bg-emerald-50 border border-emerald-100" : isNotCompleted ? "bg-red-50 border border-red-100" : "bg-gray-50 border border-amber-100")}>
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
        
        {/* Main Info Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-emerald-600/50  tracking-tighter">
              Inv. #{invoiceNumber}
            </span>
            <div className="h-3 w-[1px] bg-slate-200 hidden sm:block" />
            <h4 className="flex items-center gap-1.5 min-w-fit font-semibold text-slate-900 text-sm sm:text-base truncate">
              < Package  className="h-3.5 w-3.5 text-emerald-600/50 shrink-0"/>
              {productName}
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-500">
            <div className="flex items-center gap-1.5 min-w-fit">
              <User className="h-3.5 w-3.5 text-emerald-600/50 shrink-0" />
              <span className="truncate">{customerName}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-fit">
              <Phone className="h-3.5 w-3.5 text-emerald-600/50 shrink-0" />
              <span>{customerPhone}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-fit">
              <Truck className="h-3.5 w-3.5 text-emerald-600/50 shrink-0" />
              <span>{new Date(deliveryDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Status & Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-none border-slate-50">
          {
            !sellerReviews ?<Badge className="bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-50 whitespace-nowrap px-2 py-0.5 text-[10px] font-medium leading-tight">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>:
           sellerReviews?.review === 'COMPLETED_AS_AGREED' ? <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 whitespace-nowrap px-2 py-0.5 text-[10px] font-medium leading-tight">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge> : 
          sellerReviews?.review === 'COMPLETED_WITH_ISSUE' ? <Badge className="bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-50 whitespace-nowrap px-2 py-0.5 text-[10px] font-medium leading-tight">
            <TriangleAlert className="h-3 w-3 mr-1" />

           Completed With Issue
          </Badge> : <Badge className="bg-red-50 text-red-700 border-red-100 hover:bg-red-50 whitespace-nowrap px-2 py-0.5 text-[10px] font-medium leading-tight">
            <ShieldBan className="h-3 w-3 mr-1" />
           Not Completed
          </Badge> 
           
          }

          {
            sellerReviews &&
            <Link
            href={`/dashboard/work-ledger/${uuid}`}
            className="group flex items-center gap-0.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >  
            <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
          </Link>
          }
        </div>

      </div>
    </div>
  );
}