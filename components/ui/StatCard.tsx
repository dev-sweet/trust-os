// "use client";

// import React from "react";
// import { TrendingUp, Clock } from "lucide-react";
// import { cn } from "@/lib/utils";

// export default function StatCard() {
//   return (
//     <div className={cn("bg-white rounded-xl border border-slate-200 p-5")}>
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-sm font-medium text-slate-500">Pending Actions</p>

//           <p className="text-3xl font-bold text-slate-900 mt-1">12</p>

//           <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
//             <TrendingUp className="h-3 w-3" />
//             <span>+8% from last week</span>
//           </div>
//         </div>

//         <div className="p-3 rounded-xl bg-emerald-100">
//           <Clock className="h-5 w-5 text-emerald-600" />
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue = 0,
  iconBg = "bg-emerald-100",
  iconColor = "text-emerald-600",
  className,
}: {
  title: string;
  value: number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  trend?: "up" | "down";
  trendValue?: number;
  iconBg?: string;

  iconColor?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200 p-5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {(trend || trendValue) && (
            <div
              className={cn(
                "flex items-center gap-1 mt-2 text-xs font-medium",
                trend === "up"
                  ? "text-emerald-600"
                  : trend === "down"
                    ? "text-red-600"
                    : "text-slate-500"
              )}
            >
              {trend === "up" && <TrendingUp className="h-3 w-3" />}
              {trend === "down" && <TrendingDown className="h-3 w-3" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("p-3 rounded-xl", iconBg)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        )}
      </div>
    </div>
  );
}
