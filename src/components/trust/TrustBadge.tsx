"use client";
import { Shield, ShieldCheck, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const trustLevelConfig = {
  NEW: {
    label: "New",
    description: "Building trust",
    icon: Shield,
    bgColor: "bg-slate-100",
    textColor: "text-slate-600",
    iconColor: "text-slate-400",
    borderColor: "border-slate-200",
    iconBg: "bg-slate-200",
  },
  BUILDING: {
    label: "Building",
    description: "Trust growing",
    icon: TrendingUp,
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    iconColor: "text-amber-500",
    borderColor: "border-amber-200",
    iconBg: "bg-amber-100",
  },
  HIGH: {
    label: "High",
    description: "Trusted",
    icon: ShieldCheck,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-200",
    iconBg: "bg-emerald-100",
  },
};

// -----------------------------
// Trust Badge Component
// -----------------------------
export default function TrustBadge({
  level = "NEW",
  size = "md",
  showDescription = false,
}: {
  level?: "NEW" | "BUILDING" | "HIGH";
  size?: "sm" | "md" | "lg";
  showDescription?: boolean;
}) {
  const config = trustLevelConfig.NEW;
  // console.log(trustLevelConfig);
  const Icon = config.icon;

  const sizes = {
    sm: { badge: "px-2 py-1", icon: "h-3 w-3", text: "text-xs" },
    md: { badge: "px-3 py-1.5", icon: "h-4 w-4", text: "text-sm" },
    lg: { badge: "px-4 py-2", icon: "h-5 w-5", text: "text-base" },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border",
        config.bgColor,
        config.borderColor,
        s.badge
      )}
    >
      <Icon className={cn(s.icon, config.iconColor)} />
      <div className="flex flex-col">
        <span className={cn("font-semibold", config.textColor, s.text)}>
          {config.label}
        </span>
        {showDescription && (
          <span className={cn("text-xs opacity-70", config.textColor)}>
            {config.description}
          </span>
        )}
      </div>
    </div>
  );
}

// -----------------------------
// Trust Card Component
// -----------------------------
export function TrustCard({
  snapshot,
  className,
}: {
  snapshot?: {
    trustLevel?: "NEW" | "BUILDING" | "HIGH";
    confirmedCount?: number;
    uniqueConfirmersCount?: number;
    unresolvedDisputesCount?: number;
  };
  className?: string;
}) {
  const level = snapshot?.trustLevel || "NEW";
  const config = trustLevelConfig[level];
  const Icon = config.icon;

  const stats = [
    { label: "Confirmed", value: snapshot?.confirmedCount ?? 0 },
    { label: "Unique Clients", value: snapshot?.uniqueConfirmersCount ?? 0 },
    { label: "Open Disputes", value: snapshot?.unresolvedDisputesCount ?? 0 },
  ];

  return (
    <div
      className={cn(
        "rounded-2xl border p-6",
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            config.iconBg
          )}
        >
          <Icon className={cn("h-6 w-6", config.iconColor)} />
        </div>
        <div>
          <h3 className={cn("text-xl font-bold", config.textColor)}>
            Trust Level: {config.label}
          </h3>
          <p className="text-sm text-slate-500">{config.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <p className={cn("text-2xl font-bold", config.textColor)}>
              {stat.value}
            </p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
