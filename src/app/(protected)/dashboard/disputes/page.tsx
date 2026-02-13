"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// -----------------------------
// Types
// -----------------------------
type DisputeStatus = "OPEN" | "AWAITING_SUBJECT" | "RESOLVED";
type DisputeSeverity = "MAJOR" | "MINOR";
type OpenedBy = "SUBJECT" | "COUNTERPARTY" | "SYSTEM";

interface Dispute {
  id: string;
  workType: string;
  severity: DisputeSeverity;
  status: DisputeStatus;
  created_date: string;
  openedBy: OpenedBy;
  counterpartyText: string;
}

// -----------------------------
// Static Data
// -----------------------------
const disputesData: Dispute[] = [
  {
    id: "1",
    workType: "Delivery Issue",
    severity: "MAJOR",
    status: "AWAITING_SUBJECT",
    created_date: "2026-01-15",
    openedBy: "SUBJECT",
    counterpartyText: "The item was delayed",
  },
  {
    id: "2",
    workType: "Payment Issue",
    severity: "MINOR",
    status: "RESOLVED",
    created_date: "2026-01-10",
    openedBy: "COUNTERPARTY",
    counterpartyText: "Payment not received",
  },
  {
    id: "3",
    workType: "Service Quality",
    severity: "MINOR",
    status: "OPEN",
    created_date: "2026-01-12",
    openedBy: "SYSTEM",
    counterpartyText: "",
  },
];

const statusConfig: Record<
  DisputeStatus,
  { color: string; bg: string; border: string }
> = {
  OPEN: {
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  AWAITING_SUBJECT: {
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  RESOLVED: {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
};

// -----------------------------
// Component
// -----------------------------
export default function Disputes() {
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | "all">(
    "all"
  );
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  // Filtered & paginated disputes
  const filteredDisputes = disputesData.filter((d) =>
    statusFilter === "all" ? true : d.status === statusFilter
  );
  const totalPages = Math.ceil(filteredDisputes.length / PAGE_SIZE);
  const paginatedDisputes = filteredDisputes.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const getStatusLabel = (status: DisputeStatus) => {
    const labels: Record<DisputeStatus, string> = {
      OPEN: "Open",
      AWAITING_SUBJECT: "Awaiting Your Response",
      RESOLVED: "Resolved",
    };
    return labels[status];
  };

  const getOpenedByLabel = (openedBy: OpenedBy) => {
    const labels: Record<OpenedBy, string> = {
      SUBJECT: "You",
      COUNTERPARTY: "Customer",
      SYSTEM: "System",
    };
    return labels[openedBy];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader title="Disputes" description="All your disputes" />

      {/* Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
        <Select
          value={statusFilter}
          onValueChange={(v: DisputeStatus | "all") => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-60">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="AWAITING_SUBJECT">
              Awaiting Your Response
            </SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Disputes List */}
      <div className="space-y-3">
        {paginatedDisputes.length === 0 ? (
          <Card>
            <CardContent className="p-4 text-center text-slate-500">
              No disputes found
            </CardContent>
          </Card>
        ) : (
          paginatedDisputes.map((dispute) => {
            const config = statusConfig[dispute.status];
            const needsResponse = dispute.status === "AWAITING_SUBJECT";

            return (
              <Card
                key={dispute.id}
                className={cn(
                  "transition-all hover:shadow-md",
                  needsResponse && "border-red-200 bg-red-50/30"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <AlertTriangle
                          className={cn("h-4 w-4", config.color)}
                        />
                        <span className="font-medium text-slate-900">
                          {dispute.workType}
                        </span>
                        <Badge
                          variant={
                            dispute.severity === "MAJOR"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {dispute.severity}
                        </Badge>
                      </div>

                      <div
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2",
                          config.bg,
                          config.color
                        )}
                      >
                        {getStatusLabel(dispute.status)}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(
                            new Date(dispute.created_date),
                            "dd MMM yyyy"
                          )}
                        </span>
                        <span>
                          Opened by: {getOpenedByLabel(dispute.openedBy)}
                        </span>
                      </div>

                      {dispute.counterpartyText && (
                        <p className="text-sm text-slate-600 mt-2 line-clamp-2 bg-slate-50 p-2 rounded">
                          {dispute.counterpartyText}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {needsResponse ? (
                        <Button size="sm">Respond Now</Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          View Details <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3">
          <span className="text-sm text-slate-500">
            Showing {(page - 1) * PAGE_SIZE + 1}-
            {Math.min(page * PAGE_SIZE, filteredDisputes.length)} of{" "}
            {filteredDisputes.length}
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
