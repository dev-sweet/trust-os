import React from "react";
import { CheckCircle2, AlertCircle, Users, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TrustReasons({
  snapshot,
  verification,
}: {
  snapshot: any;
  verification: any;
}) {
  const isVerified = verification?.status === "APPROVED";
  const confirmedCount = snapshot?.confirmedCount || 0;
  const disputeCount = snapshot?.unresolvedDisputesCount || 0;
  const uniqueClients = snapshot?.uniqueConfirmersCount || 0;

  const reasons = [
    {
      icon: Shield,
      positive: isVerified,
      text: isVerified ? "Identity verified" : "Verify your identity",
      color: isVerified ? "text-emerald-600" : "text-amber-600",
      bg: isVerified ? "bg-emerald-50" : "bg-amber-50",
    },
    {
      icon: CheckCircle2,
      positive: confirmedCount >= 5,
      text:
        confirmedCount > 0
          ? `${confirmedCount} confirmed events`
          : "Get more confirmations",
      color: confirmedCount >= 5 ? "text-emerald-600" : "text-amber-600",
      bg: confirmedCount >= 5 ? "bg-emerald-50" : "bg-amber-50",
    },
    {
      icon: AlertCircle,
      positive: disputeCount === 0,
      text:
        disputeCount === 0
          ? "No unresolved disputes"
          : `${disputeCount} unresolved disputes`,
      color: disputeCount === 0 ? "text-emerald-600" : "text-red-600",
      bg: disputeCount === 0 ? "bg-emerald-50" : "bg-red-50",
    },
    {
      icon: Users,
      positive: uniqueClients >= 10,
      text:
        uniqueClients > 0
          ? `${uniqueClients} unique clients`
          : "Work with more clients",
      color: uniqueClients >= 10 ? "text-emerald-600" : "text-amber-600",
      bg: uniqueClients >= 10 ? "bg-emerald-50" : "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-2">
      {reasons.map((reason, i) => (
        <div
          key={i}
          className={cn("flex items-center gap-3 p-3 rounded-lg", reason.bg)}
        >
          <reason.icon className={cn("h-5 w-5", reason.color)} />
          <span className={cn("text-sm font-medium", reason.color)}>
            {reason.text}
          </span>
        </div>
      ))}
    </div>
  );
}
