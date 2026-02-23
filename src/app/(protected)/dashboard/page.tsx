"use client";
import Link from "next/link";
import {
  Plus,
  Share2,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrustCard } from "@/components/trust/TrustBadge";
import WorkEventCard from "@/components/work/WorkEventCard";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import TrustReasons from "@/components/trust/TrustReasons";
import { useAuthStore } from "@/store/authStore";
import { useTranslations } from "use-intl";
import { useGetAllOrders } from "@/hooks/useOrderMutations";
import { useActiveAccount } from "@/store/accoutStore";

/* -----------------------------
   STATIC MOCK DATA
-------------------------------- */

const trustSnapshot = {
  score: 82,
  confirmedCount: 14,
};


const pendingEvents = [{ id: 1 }, { id: 2 }];
const disputes = [{ id: 1 }];

// const cookieStore = cookies();
// const token = localStorage.getItem("token");
export default function Dashboard() {
  const activeAccount = useActiveAccount();
  console.log('Active Account:', activeAccount);

  const {data:recentEvents,isLoading} = useGetAllOrders(activeAccount?.id as string);
  console.log('Recent Events:', recentEvents);
  const { user } = useAuthStore();

  const t = useTranslations('DashboardPage');
  
  if(isLoading){
    return <div>Loading...</div>
  }
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r  from-emerald-700 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm mb-1">{t('welcome')}</p>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              asChild
            >
              <Link href="/dashboard/share">
                <Share2 className="h-4 w-4 mr-2" />
                {t('shareProfile')}
              </Link>
            </Button>

            <Button
              className="bg-white text-emerald-700 hover:bg-emerald-50"
              asChild
            >
              <Link href="/dashboard/create-order">
                <Plus className="h-4 w-4 mr-2" />
                {t('createLink')}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="sm:hidden grid grid-cols-2 gap-3">
        <Button asChild>
          <Link href="create-order">
            <Plus className="h-4 w-4 mr-2" />
            {t('createLink')}
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/share">
            <Share2 className="h-4 w-4 mr-2" />
            {t('shareProfile')}
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title={t('pendingActions')}
          value={pendingEvents.length}
          icon={Clock}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
        <StatCard
          title={t('confirmedEvents')}
          value={trustSnapshot.confirmedCount}
          icon={CheckCircle2}
          trend="down"
          trendValue={20}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          title={t('openDisputes')}
          value={disputes.length}
          icon={AlertTriangle}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trust Summary */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t('yourTrustSummary')}</h2>
              <Link
                href="/trust-center"
                className="text-sm text-emerald-600 flex items-center gap-1"
              >
              View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <TrustCard  snapshot={trustSnapshot} />
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t('recentActivity')}</h2>
              <Link
                href="/work-ledger"
                className="text-sm text-emerald-600 flex items-center gap-1"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentEvents.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No recent activity"
                  description="Add your first work event to start building trust"
                  actionLabel="Add Work Event"
                  actionHref="/work-events/add"
                />
              ) : (
                recentEvents.map((event:any) => (
                  <WorkEventCard key={event.id} order={event} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Improve Trust */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-amber-500" />
                {t('improveTrust')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TrustReasons snapshot={trustSnapshot} verification={true} />
            </CardContent>
          </Card>

          {/* Pending Alert */}
          {pendingEvents.length > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <div>
                    <h4 className="font-medium">
                      {pendingEvents.length} {t('pendingConfirmation')}
                    </h4>
                    <p className="text-sm text-amber-700">
                      {t('waitingForCustomer')}
                    </p>
                    <Link
                      href="/action-center"
                      className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 mt-2"
                    >
                      {t('goToActionCenter')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dispute Alert */}
          {disputes.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <h4 className="font-medium">
                      {disputes.length} {t('openDisputesCount')}
                    </h4>
                    <p className="text-sm text-red-700">
                      {t('quickResolution')}
                    </p>
                    <Link
                      href="/disputes"
                      className="inline-flex items-center gap-1 text-sm font-medium text-red-700 mt-2"
                    >
                      {t('viewDisputes')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
