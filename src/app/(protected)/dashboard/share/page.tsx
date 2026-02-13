"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Check,
  Download,
  ExternalLink,
  QrCode,
  Share2,
  Link as LinkIcon,
  Facebook,
  MessageCircle,
  Shield,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
// import TrustBadge from "@/components/trust/TrustBadge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

// Static user & profile data
const staticUser = {
  id: "123",
  name: "John Doe",
  avatarUrl: "",
};

const staticProfile = {
  category: "Professional",
  publicHandle: "john-doe",
};

// const staticTrustSnapshot = {
//   trustLevel: "TRUSTED",
// };

export default function Share() {
  const [copied, setCopied] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState<number | null>(null);

  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/PublicProfile?id=${staticProfile.publicHandle}`;

  const copyToClipboard = (text: string, type: number | "link" = "link") => {
    navigator.clipboard.writeText(text);
    if (type === "link") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopiedTemplate(type as number);
      setTimeout(() => setCopiedTemplate(null), 2000);
    }
  };

  const templates = [
    {
      id: 1,
      text: `I'm verified on AmrAstha! Check my trust profile: ${profileUrl}`,
    },
    {
      id: 2,
      text: `Verify my AmrAstha profile to ensure trusted service: ${profileUrl}`,
    },
    { id: 3, text: `Click this link to verify my work quality: ${profileUrl}` },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Share"
        description="Share your trust profile"
        actions={
          <Button variant="outline" asChild>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview Profile
            </a>
          </Button>
        }
      />

      {/* Trust Level Preview */}
      <Card className="bg-linear-to-r from-emerald-50 to-teal-50 border-emerald-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                {staticUser.avatarUrl ? (
                  <Image
                    src={staticUser.avatarUrl}
                    height={40}
                    width={40}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Shield className="h-8 w-8 text-emerald-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {staticUser.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {staticProfile.category}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="link">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="link">
            <LinkIcon className="h-4 w-4 mr-2" />
            Public Link
          </TabsTrigger>
          <TabsTrigger value="qr">
            <QrCode className="h-4 w-4 mr-2" />
            QR Code
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Share2 className="h-4 w-4 mr-2" />
            Share Templates
          </TabsTrigger>
        </TabsList>

        {/* Public Link */}
        <TabsContent value="link" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Public Link</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input value={profileUrl} readOnly className="bg-slate-50" />
                <Button
                  onClick={() => copyToClipboard(profileUrl)}
                  className={cn(
                    "transition-all min-w-28",
                    copied && "bg-emerald-600"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Share */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Share on</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
                      "_blank",
                      "width=600,height=400"
                    )
                  }
                >
                  <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(`I'm verified on AmrAstha! Check my trust profile: ${profileUrl}`)}`,
                      "_blank"
                    )
                  }
                >
                  <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* QR Code */}
        <TabsContent value="qr" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">QR Code</CardTitle>
              <CardDescription>
                Scan this QR code to view the profile
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-64 h-64 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center mb-4">
                <div className="text-center p-4">
                  <QrCode className="h-32 w-32 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">QR Code</p>
                  <p className="text-xs text-slate-500 mt-1 break-all">
                    {profileUrl}
                  </p>
                </div>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download QR
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Share Templates */}
        <TabsContent value="templates" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Share Templates</CardTitle>
              <CardDescription>
                Copy these templates to share on social media
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="space-y-2">
                  <Textarea
                    value={template.text}
                    readOnly
                    className="bg-slate-50 resize-none"
                    rows={3}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(template.text, template.id)}
                    className={cn(
                      "transition-all",
                      copiedTemplate === template.id &&
                        "bg-emerald-50 text-emerald-600 border-emerald-200"
                    )}
                  >
                    {copiedTemplate === template.id ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Template
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
