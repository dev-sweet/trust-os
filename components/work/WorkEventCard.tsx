"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ----------------------------- STATUS CONFIG ----------------------------- */

type StatusConfigItem = {
  text: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  bg: string;
  border: string;
};

export const statusConfig = {
  PENDING_CONFIRMATION: {
    text: "Pending Confirmation",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  CONFIRMED: {
    text: "Confirmed",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  ISSUE: {
    text: "Issue Reported",
    icon: AlertTriangle,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  FAILED: {
    text: "Failed",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  EXPIRED: {
    text: "Expired",
    icon: Clock,
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
  CANCELLED: {
    text: "Cancelled",
    icon: XCircle,
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
} as const satisfies Record<string, StatusConfigItem>;

export type StatusKey = keyof typeof statusConfig;

/* ----------------------------- CATEGORY CONFIG ---------------------------- */

export const categoryLabels = {
  SELLER: "Seller",
  TUTOR: "Tutor",
  RIDER: "Rider",
  TECHNICIAN: "Technician",
  FREELANCER: "Freelancer",
  OTHER: "Other",
} as const;

export type CategoryKey = keyof typeof categoryLabels;

/* --------------------------------- EVENT TYPE ---------------------------- */

export type Event = {
  id: number | string;
  title?: string;
  workType?: string;
  counterpartyName?: string;
  description?: string;
  status: StatusKey;
  category?: CategoryKey;
  occurredAt?: Date;
  subjectType?: "INDIVIDUAL" | "ORGANIZATION";
};

/* -------------------------------- PROPS ---------------------------------- */

type WorkEventCardProps = {
  event: Event;
  showLink?: boolean;
};

/* ------------------------------ COMPONENT -------------------------------- */

export default function WorkEventCard({
  event,
  showLink = true,
}: WorkEventCardProps) {
  const status = statusConfig[event.status];
  const StatusIcon = status.icon;

  const category = categoryLabels[event.category ?? "OTHER"];

  return (
    <div
      className={cn(
        "bg-white rounded-xl border p-4 transition-all hover:shadow-md",
        status.border,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="border-slate-300 h-5 min-w-5 rounded-full px-2 text-sm text-gray-600"
            >
              {category}
            </Badge>

            {event.workType && (
              <span className="text-xs text-slate-500">{event.workType}</span>
            )}
          </div>

          {/*  TITLE USED HERE */}
          <h4 className="font-medium text-slate-900 mb-1 truncate">
            {event.title}
          </h4>

          {event.description && (
            <p className="text-sm text-slate-500 line-clamp-2 mb-2">
              {event.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-slate-400">
            {event.subjectType === "ORGANIZATION" && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                Organization
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
              status.bg,
              status.color,
            )}
          >
            <StatusIcon className="h-3 w-3" />
            {status.text}
          </div>

          {showLink && (
            <Link
              href={`/work-event-detail?id=${event.id}`}
              className="text-emerald-600 hover:text-emerald-700 flex items-center"
            >
              <ChevronRight className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- SKELETON ---------------------------------- */

export function WorkEventSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex gap-2 mb-2">
            <div className="h-5 w-16 bg-slate-200 rounded" />
            <div className="h-5 w-24 bg-slate-200 rounded" />
          </div>
          <div className="h-5 w-32 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
        </div>
        <div className="h-6 w-20 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
}
