"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Users,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Camera,
  Info,
} from "lucide-react";

// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PageHeader from "@/components/ui/PageHeader";
import TrustBadge, { TrustCard } from "@/components/trust/TrustBadge";
import TrustReasons from "@/components/trust/TrustReasons";
import { cn } from "@/lib/utils";

/* ------------------ STATIC DATA ------------------ */
const trustSnapshot = {
  trustLevel: "BUILDING",
  confirmedCount: 7,
  uniqueConfirmersCount: 4,
  unresolvedDisputesCount: 1,
} as const;

const verification = {
  status: "APPROVED",
};

const progress = {
  current: 7,
  target: 20,
  percent: 35,
};

const improvementSteps = [
  {
    icon: Camera,
    title: "Verify Identity",
    description: "Confirm identity with NID and selfie",
    status: "completed",
    href: "/settings",
    importance: "high",
  },
  {
    icon: CheckCircle2,
    title: "Get Confirmations",
    description: "Collect work confirmations from customers",
    status: "pending",
    progress: { current: 7, target: 20 },
    href: "/add-work",
    importance: "high",
  },
  {
    icon: AlertTriangle,
    title: "Resolve Disputes",
    description: "Quickly resolve all open disputes",
    status: "pending",
    href: "/disputes",
    importance: "high",
  },
  {
    icon: Users,
    title: "Diversify Clients",
    description: "Work with different customers",
    status: "pending",
    progress: { current: 4, target: 10 },
    href: "/add-work",
    importance: "medium",
  },
];

/* ------------------ COMPONENT ------------------ */

export default function TrustCenter() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Trust Center"
        description="Your trust score and how to improve"
      />

      {/* Main Trust Card */}

      <TrustCard snapshot={trustSnapshot} className="mb-8" />
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Improvement Steps */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            How to Improve
          </h2>

          {improvementSteps.map((step, index) => (
            <Card
              key={index}
              className={cn(
                "transition-all hover:shadow-md",
                step.status === "completed"
                  ? "border-emerald-200 bg-emerald-50/50"
                  : step.importance === "high"
                    ? "border-amber-200"
                    : "",
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl",
                      step.status === "completed"
                        ? "bg-emerald-100"
                        : "bg-slate-100",
                    )}
                  >
                    <step.icon
                      className={cn(
                        "h-5 w-5",
                        step.status === "completed"
                          ? "text-emerald-600"
                          : "text-slate-500",
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium">{step.title}</h3>

                      {step.status === "completed" ? (
                        <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </span>
                      ) : (
                        <Link
                          href={step.href}
                          className="text-xs font-medium text-emerald-600 flex items-center gap-1"
                        >
                          Start
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>

                    <p className="text-sm text-slate-500">{step.description}</p>

                    {step.progress && step.status !== "completed" && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>
                            {step.progress.current} / {step.progress.target}
                          </span>
                          <span>
                            {Math.round(
                              (step.progress.current / step.progress.target) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            (step.progress.current / step.progress.target) * 100
                          }
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Level Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Level Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress.percent} className="h-3 mb-3" />

              <div className="flex items-center justify-between">
                <TrustBadge level="BUILDING" size="sm" />
                <ArrowRight className="h-4 w-4 text-slate-400" />
                <TrustBadge level="HIGH" size="sm" />
              </div>
            </CardContent>
          </Card>

          {/* Trust Breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Trust Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <TrustReasons
                snapshot={trustSnapshot}
                verification={verification}
              />
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-linear-to-br from-emerald-50 to-teal-50 border-emerald-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4 text-emerald-600" />
                Trust Building Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Request confirmation after each work</li>
                <li>• Be kind to customers</li>
                <li>• Resolve issues quickly</li>
                <li>• Work regularly</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
