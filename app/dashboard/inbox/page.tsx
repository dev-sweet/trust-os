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
import { ChevronRight } from "lucide-react";
import {
  Inbox as InboxIcon,
  CheckCircle2,
  Bell,
  AlertTriangle,
  MessageSquare,
  Shield,
  Settings,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { IoPaperPlaneOutline } from "react-icons/io5";

// types
type NotificationType = keyof typeof typeConfig;

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  created_date: string;
  linkUrl?: string;
}

// Static notifications data
const notificationsData: Notification[] = [
  {
    id: "1",
    type: "CONFIRMATION_COMPLETED",
    title: "Payment Confirmed",
    body: "Your payment has been successfully processed.",
    isRead: false,
    created_date: "2026-01-18T09:00:00Z",
    linkUrl: "/notifications/1",
  },
  {
    id: "2",
    type: "DISPUTE_OPENED",
    title: "Dispute Opened",
    body: "A dispute has been opened for your last order.",
    isRead: true,
    created_date: "2026-01-16T14:00:00Z",
    linkUrl: "/notifications/2",
  },
  {
    id: "3",
    type: "VERIFICATION_STATUS",
    title: "Verification Pending",
    body: "Your account verification is still pending.",
    isRead: false,
    created_date: "2026-01-15T10:00:00Z",
    linkUrl: "/notifications/3",
  },
];

const typeConfig = {
  CONFIRMATION_COMPLETED: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  CONFIRMATION_PENDING: {
    icon: Bell,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  DISPUTE_OPENED: {
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-100",
  },
  DISPUTE_UPDATED: {
    icon: MessageSquare,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  VERIFICATION_STATUS: {
    icon: Shield,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  SYSTEM: { icon: Settings, color: "text-slate-600", bg: "bg-slate-100" },
};

export default function Inbox() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");

  const filteredNotifications = notificationsData.filter((notif) => {
    if (typeFilter !== "all" && notif.type !== typeFilter) return false;
    if (readFilter === "unread" && notif.isRead) return false;
    return true;
  });

  const unreadCount = notificationsData.filter((n) => !n.isRead).length;

  const getTimeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Just now";
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Inbox"
        description="All your notifications"
        actions={
          unreadCount > 0 && (
            <Button variant="outline" size="sm">
              Mark all as read <IoPaperPlaneOutline />
            </Button>
          )
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="CONFIRMATION_COMPLETED">
                Confirmation
              </SelectItem>
              <SelectItem value="DISPUTE_OPENED">Dispute</SelectItem>
              <SelectItem value="VERIFICATION_STATUS">Verification</SelectItem>
              <SelectItem value="SYSTEM">System</SelectItem>
            </SelectContent>
          </Select>

          <Select value={readFilter} onValueChange={setReadFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
            </SelectContent>
          </Select>

          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount} Unread</Badge>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <EmptyState
            icon={InboxIcon}
            title="No notifications"
            description="Your inbox is empty"
          />
        ) : (
          filteredNotifications.map((notif) => {
            const config = typeConfig[notif.type] || typeConfig.SYSTEM;
            const Icon = config.icon;

            return (
              <Card
                key={notif.id}
                className={cn(
                  "transition-all hover:shadow-sm cursor-pointer",
                  !notif.isRead && "bg-emerald-50/50 border-emerald-100",
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-2 rounded-full", config.bg)}>
                      <Icon className={cn("h-5 w-5", config.color)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4
                            className={cn(
                              "font-medium text-slate-900",
                              !notif.isRead && "font-semibold",
                            )}
                          >
                            {notif.title}
                          </h4>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {notif.body}
                          </p>
                        </div>
                        {!notif.isRead && (
                          <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-400">
                          {getTimeAgo(notif.created_date)}
                        </span>
                        {notif.linkUrl && (
                          <a
                            href={notif.linkUrl}
                            className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                          >
                            View <ChevronRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
