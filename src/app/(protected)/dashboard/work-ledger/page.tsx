"use client";

import React, { useState } from "react";
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

// Types
type EventStatus =
  | "PENDING_CONFIRMATION"
  | "CONFIRMED"
  | "ISSUE"
  | "FAILED"
  | "EXPIRED"
  | "CANCELLED";

type EventCategory =
  | "SELLER"
  | "TUTOR"
  | "RIDER"
  | "TECHNICIAN"
  | "FREELANCER"
  | "OTHER";

interface WorkEvent {
  id: string;
  workType: string;
  counterpartyName: string;
  description: string;
  occurredAt: Date;
  status: EventStatus;
  category: EventCategory;
}
// -----------------------------
// Static Translations
// -----------------------------
const t = {
  title: "Work Ledger",
  subtitle: "All your work records",
  addEvent: "Add Event",
  search: "Search...",
  allStatus: "All Status",
  pending: "Pending",
  confirmed: "Confirmed",
  issue: "Issue",
  failed: "Failed",
  expired: "Expired",
  cancelled: "Cancelled",
  allCategories: "All Categories",
  seller: "Seller",
  tutor: "Tutor",
  rider: "Rider",
  technician: "Technician",
  freelancer: "Freelancer",
  other: "Other",
  dateRange: "Date",
  noEvents: "No events found",
  noEventsDesc: "Add your first work event to start building trust",
  showing: "Showing",
  of: "of",
  events: "events",
  export: "Export",
};

// -----------------------------
// Static Events
// -----------------------------
const staticEvents: WorkEvent[] = [
  {
    id: "1",
    workType: "Website Design",
    counterpartyName: "John Doe",
    description: "Landing page design for client",
    occurredAt: new Date("2026-01-10"),
    status: "CONFIRMED",
    category: "FREELANCER",
  },
  {
    id: "2",
    workType: "Delivery",
    counterpartyName: "Jane Smith",
    description: "Delivered documents",
    occurredAt: new Date("2026-01-12"),
    status: "PENDING_CONFIRMATION",
    category: "RIDER",
  },
  {
    id: "3",
    workType: "Tutoring Session",
    counterpartyName: "Ali Khan",
    description: "Math tutoring",
    occurredAt: new Date("2026-01-15"),
    status: "CONFIRMED",
    category: "TUTOR",
  },
  {
    id: "4",
    workType: "Software Setup",
    counterpartyName: "Sara Ahmed",
    description: "Installed ERP software",
    occurredAt: new Date("2026-01-16"),
    status: "ISSUE",
    category: "TECHNICIAN",
  },
];

// -----------------------------
// Constants
// -----------------------------
const statusOptions = [
  { value: "all", label: t.allStatus },
  { value: "PENDING_CONFIRMATION", label: t.pending },
  { value: "CONFIRMED", label: t.confirmed },
  { value: "ISSUE", label: t.issue },
  { value: "FAILED", label: t.failed },
  { value: "EXPIRED", label: t.expired },
  { value: "CANCELLED", label: t.cancelled },
];

const categoryOptions = [
  { value: "all", label: t.allCategories },
  { value: "SELLER", label: t.seller },
  { value: "TUTOR", label: t.tutor },
  { value: "RIDER", label: t.rider },
  { value: "TECHNICIAN", label: t.technician },
  { value: "FREELANCER", label: t.freelancer },
  { value: "OTHER", label: t.other },
];

const PAGE_SIZE = 10;

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

  // -----------------------------
  // Filter Events
  // -----------------------------
  const filteredEvents = staticEvents.filter((event) => {
    if (statusFilter !== "all" && event.status !== statusFilter) return false;
    if (categoryFilter !== "all" && event.category !== categoryFilter)
      return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !event.workType.toLowerCase().includes(query) &&
        !event.counterpartyName.toLowerCase().includes(query) &&
        !event.description.toLowerCase().includes(query)
      )
        return false;
    }
    if (dateFrom && event.occurredAt < dateFrom) return false;
    if (dateTo && event.occurredAt > dateTo) return false;
    return true;
  });

  // -----------------------------
  // Pagination
  // -----------------------------
  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE);
  const paginatedEvents = filteredEvents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const clearFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setSearchQuery("");
    setDateFrom(null);
    setDateTo(null);
    setPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        title={t.title}
        description={t.subtitle}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t.addEvent}
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
              placeholder={t.search}
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
              <SelectValue placeholder={t.allStatus} />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder={t.allCategories} />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Calendar className="h-4 w-4 mr-2" />
                {dateFrom ? format(dateFrom, "dd/MM") : t.dateRange}
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
        {(statusFilter !== "all" ||
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
        )}
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {paginatedEvents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t.noEvents}
            description={t.noEventsDesc}
            actionLabel={t.addEvent}
          />
        ) : (
          paginatedEvents.map((event) => (
            <WorkEventCard key={event.id} event={event} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3">
          <span className="text-sm text-slate-500">
            {t.showing} {(page - 1) * PAGE_SIZE + 1}-
            {Math.min(page * PAGE_SIZE, filteredEvents.length)} {t.of}{" "}
            {filteredEvents.length}
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
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
