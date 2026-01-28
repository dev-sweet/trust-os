"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Plus, MessageSquare } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

// -------------------
// Types
// -------------------
export type StatusKey = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface StatusItem {
  label: string;
  color: string;
  bg: string;
}

export type CategoryValue =
  | "KYC"
  | "DISPUTE"
  | "BUG"
  | "ABUSE"
  | "BILLING"
  | "OTHER";

export interface Category {
  value: CategoryValue;
  label: string;
}

export interface Ticket {
  id: number;
  category: CategoryValue;
  status: StatusKey;
  message: string;
  created_date: string;
  responseMessage: string;
}

export interface FAQ {
  q: string;
  a: string;
}

// -------------------
// Static Data
// -------------------
const categories: Category[] = [
  { value: "KYC", label: "Identity Verification" },
  { value: "DISPUTE", label: "Dispute Related" },
  { value: "BUG", label: "Bug Report" },
  { value: "ABUSE", label: "Report Abuse" },
  { value: "BILLING", label: "Billing" },
  { value: "OTHER", label: "Other" },
];

const statusConfig: Record<StatusKey, StatusItem> = {
  OPEN: { label: "Open", color: "text-amber-600", bg: "bg-amber-50" },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  RESOLVED: {
    label: "Resolved",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  CLOSED: { label: "Closed", color: "text-slate-600", bg: "bg-slate-50" },
};

const staticTickets: Ticket[] = [
  {
    id: 1,
    category: "KYC",
    status: "OPEN",
    message: "How do I verify my identity?",
    created_date: "2026-01-19T08:00:00Z",
    responseMessage: "",
  },
  {
    id: 2,
    category: "DISPUTE",
    status: "IN_PROGRESS",
    message: "I have a dispute with a client.",
    created_date: "2026-01-18T14:30:00Z",
    responseMessage: "We are reviewing your dispute.",
  },
  {
    id: 3,
    category: "BUG",
    status: "RESOLVED",
    message: "Found a bug in the dashboard.",
    created_date: "2026-01-17T10:15:00Z",
    responseMessage: "Bug fixed, please refresh.",
  },
];

const faqs: FAQ[] = [
  {
    q: "How do I increase my trust?",
    a: "Collect confirmations from customers and resolve issues quickly.",
  },
  {
    q: "How does confirmation work?",
    a: "When you add work, a link is sent to the customer. The customer clicks to confirm.",
  },
  {
    q: "What to do if there is a dispute?",
    a: "Go to the disputes page and resolve the issue with the customer.",
  },
];

// -------------------
// Support Component
// -------------------
export default function Support() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ticketData, setTicketData] = useState<{
    category: CategoryValue | "";
    message: string;
  }>({
    category: "",
    message: "",
  });
  const [tickets, setTickets] = useState<Ticket[]>(staticTickets);

  const createTicket = () => {
    if (!ticketData.category || !ticketData.message) return;

    const newTicket: Ticket = {
      id: tickets.length + 1,
      category: ticketData.category as CategoryValue,
      status: "OPEN",
      message: ticketData.message,
      created_date: new Date().toISOString(),
      responseMessage: "",
    };

    setTickets([newTicket, ...tickets]);
    setDialogOpen(false);
    setTicketData({ category: "", message: "" });
    alert("Ticket created!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header + New Ticket */}
      <PageHeader
        title="Help & Support"
        description="We're here to help you"
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Ticket</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={ticketData.category}
                    onValueChange={(v) =>
                      setTicketData((p) => ({
                        ...p,
                        category: v as CategoryValue,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    value={ticketData.message}
                    onChange={(e) =>
                      setTicketData((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="Describe your issue in detail..."
                    rows={5}
                  />
                </div>

                <Button
                  onClick={createTicket}
                  disabled={!ticketData.category || !ticketData.message}
                  className="w-full"
                >
                  Submit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-b border-slate-100 last:border-0 pb-4 last:pb-0"
            >
              <h4 className="font-medium text-slate-900 mb-1">{faq.q}</h4>
              <p className="text-sm text-slate-500">{faq.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Your Tickets
        </h2>

        {tickets.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No tickets"
            description="You have no support tickets"
          />
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => {
              const status = statusConfig[ticket.status]; // ✅ fully typed
              const category = categories.find(
                (c) => c.value === ticket.category,
              );

              return (
                <Card
                  key={ticket.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            {category?.label || ticket.category}
                          </Badge>
                          <Badge
                            className={cn(status.bg, status.color, "border-0")}
                          >
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {ticket.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          {new Date(ticket.created_date).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {ticket.responseMessage && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-slate-500 mb-1">Response:</p>
                        <p className="text-sm text-slate-700">
                          {ticket.responseMessage}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
