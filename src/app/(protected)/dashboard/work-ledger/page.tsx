"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import PageHeader from "@/components/ui/PageHeader";
import WorkEventCard from "@/components/work/WorkEventCard";
// import WorkEventSkeleton from "@/components/work/WorkEventSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import api from "@/utils/axios";
import { useActiveAccount } from "@/store/accoutStore";
import { useGetAllOrders } from "@/hooks/useOrderMutations";

type SellerReviews = {
  id: number;
  review: "COMPLETED_AS_AGREED" | string;
  isReviewed: boolean;
};

type Meta = {
  totalOrders: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export type WorkLedger = {
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  deliveryDate: string;
  id: number;
  invoiceNumber: string;
  link: string;
  linkExpiry: string;
  meta: Meta;
  orderDate: string;
  productName: string;
  sellerReviews: SellerReviews;
  uuid: string;
};
// -----------------------------
// Component
// -----------------------------
export default function WorkLedgerStatic() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = 10; // Math.ceil(filteredEvents.length / PAGE_SIZE);  
  const {id:businessId} = useActiveAccount();
  const {data:workEvents,isLoading} = useGetAllOrders(businessId as string);


  const clearFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setSearchQuery("");
    setDateFrom(null);
    setDateTo(null);
    setPage(1);
  };

  // useEffect(() => {
  //   api.get(`/api/user/orders?businessId=${businessId}`).then((res) => {
  //     console.log(res.data);
  //   });
  // }, []);
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Work Ledger"
        description="View and manage your work events"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder='Search by customer, product, or invoice...'
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            {/* <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent> */}
          </Select>

          {/* Category Filter */}
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            {/* <SelectContent>
              {categoryOptions.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent> */}
          </Select>

          {/* Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Calendar className="h-4 w-4 mr-2" />
                {/* {dateFrom ? format(dateFrom, "dd/MM") : } */}
                {dateTo && ` - ${format(dateTo, "dd/MM")}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="range"
                selected={{
                  from: dateFrom ?? undefined,
                  to: dateTo ?? undefined,
                }}
                onSelect={(range) => {
                  setDateFrom(range?.from ?? null);
                  setDateTo(range?.to ?? null);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Active Filters Summary */}
        {/* {(statusFilter !== "all" ||
          categoryFilter !== "all" ||
          searchQuery ||
          dateFrom) && (
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <span className="text-sm text-slate-500">
              {t.showing} {filteredEvents.length} {t.of} {staticEvents.length}{" "}
              {t.events}
            </span>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )} */}
      </div>

      {/* Events List */}
      {
        isLoading ? <h1>Loading...</h1> : <div className="space-y-3">
        {workEvents?.length === 0 ? (
          <EmptyState
            icon={FileText}
            title='No work events found'
            description="You haven't added any work events yet."
            actionLabel="Add Event"
          />
        ) : (
          workEvents?.map((event:WorkLedger) => (
            <WorkEventCard key={event.id} order={event} />
          ))
        )}
      </div>
      }
      

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3">
          <span className="text-sm text-slate-500">
            {/* {t.showing} {(page - 1) * PAGE_SIZE + 1}-
            {Math.min(page * PAGE_SIZE, filteredEvents.length)} {t.of}{" "}
            {filteredEvents.length} */}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-2">

              {/* {page} s */}
            </span>
            <Button
              variant="outline"
              size="icon"
              // disabled={page === totalPages}
              // onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
