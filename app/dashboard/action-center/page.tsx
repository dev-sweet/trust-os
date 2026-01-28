"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  AlertTriangle,
  Send,
  CheckCircle2,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

/* --------------------------------
   STATIC DATA
---------------------------------- */
const pendingConfirmations = [
  {
    id: "1",
    counterpartyName: "Acme Corp",
    occurredAt: "2025-01-10",
    tokenExpiresAt: "2025-01-20",
  },
  {
    id: "2",
    counterpartyName: "Design Studio",
    occurredAt: "2025-01-12",
    tokenExpiresAt: "2025-01-16",
  },
];

const disputes = [
  {
    id: "d1",
    workType: "Website Development",
    createdAt: "2025-01-05",
  },
];

/* --------------------------------
   ACTION ITEM (STATIC)
---------------------------------- */
function ActionItem({
  item,
  type,
}: {
  item: any;
  type: "confirmation" | "dispute";
}) {
  const isUrgent =
    type === "confirmation"
      ? differenceInDays(new Date(item.tokenExpiresAt), new Date()) <= 3
      : true;

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        isUrgent && "border-amber-200 bg-amber-50/30"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {type === "confirmation" ? (
                <Clock className="h-4 w-4 text-amber-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}

              <span className="font-medium text-slate-900">
                {item.counterpartyName || item.workType}
              </span>

              {isUrgent && (
                <Badge variant="destructive" className="text-xs">
                  Urgent
                </Badge>
              )}
            </div>

            <p className="text-sm text-slate-500 mb-2">
              {type === "confirmation"
                ? "Waiting for customer confirmation"
                : "Needs your response"}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(
                  new Date(item.occurredAt || item.createdAt),
                  "dd MMM yyyy"
                )}
              </span>

              {type === "confirmation" && (
                <span className="font-medium text-red-500">
                  Expires in{" "}
                  {differenceInDays(new Date(item.tokenExpiresAt), new Date())}{" "}
                  days
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {type === "confirmation" && (
              <Button variant="outline" size="sm">
                <Send className="h-4 w-4 mr-1" />
                Send Reminder
              </Button>
            )}

            {type === "dispute" && (
              <Button size="sm" asChild>
                <Link href="/disputes/1">Respond Now</Link>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/work-events/1">View Details</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* --------------------------------
   ACTION CENTER PAGE
---------------------------------- */
export default function ActionCenterPage() {
  const [activeTab, setActiveTab] = useState("confirmations");

  return (
    <div className="space-y-6">
      <PageHeader title="Action Center" description="Your pending tasks" />

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-100">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-900">
                {pendingConfirmations.length}
              </p>
              <p className="text-sm text-amber-700">Pending Confirmations</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "border-red-200",
            disputes.length > 0 ? "bg-red-50" : "bg-slate-50 border-slate-200"
          )}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div
              className={cn(
                "p-3 rounded-xl",
                disputes.length > 0 ? "bg-red-100" : "bg-slate-100"
              )}
            >
              <AlertTriangle
                className={cn(
                  "h-6 w-6",
                  disputes.length > 0 ? "text-red-600" : "text-slate-400"
                )}
              />
            </div>
            <div>
              <p className="text-2xl font-bold">{disputes.length}</p>
              <p className="text-sm text-slate-600">Open Disputes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="confirmations">
            Pending Confirmations
            {pendingConfirmations.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingConfirmations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="disputes">
            Open Disputes
            {disputes.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {disputes.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="confirmations" className="space-y-3 mt-4">
          {pendingConfirmations.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No pending actions"
              description="All good! No urgent tasks."
            />
          ) : (
            pendingConfirmations.map((item) => (
              <ActionItem key={item.id} item={item} type="confirmation" />
            ))
          )}
        </TabsContent>

        <TabsContent value="disputes" className="space-y-3 mt-4">
          {disputes.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No pending actions"
              description="All good! No urgent tasks."
            />
          ) : (
            disputes.map((item) => (
              <ActionItem key={item.id} item={item} type="dispute" />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
