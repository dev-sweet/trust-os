"use client";

import { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Eye,
  Camera,
  Upload,
  // Check,
  // AlertCircle,
  Clock,
  // Loader2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
export default function UserSettings() {
  // Static profile data
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    category: "Seller",
    locationDistrict: "Dhaka",
    locationCity: "Uttara",
    bio: "I am a Next.js developer.",
    publicHandle: "johndoe",
    publicVisibility: true,
  });

  const [nidFile, setNidFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  const categories = [
    { value: "SELLER", label: "Seller" },
    { value: "TUTOR", label: "Tutor" },
    { value: "RIDER", label: "Rider" },
    { value: "TECHNICIAN", label: "Technician" },
    { value: "FREELANCER", label: "Freelancer" },
    { value: "OTHER", label: "Other" },
  ];

  const verificationStatus = {
    label: "Pending",
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: Clock,
    reviewerNote: "Your NID verification is under review.",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader title="Settings" description="Manage your account settings" />

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-4 rounded-lg bg-gray-100">
          <TabsTrigger className="cursor-pointer" value="profile">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="identity">
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Identity</span>
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="privacy">
            <Eye className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={profileData.name}
                    placeholder="Please enter your name"
                    onChange={(e) =>
                      setProfileData((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={profileData.category}
                    onValueChange={(v) =>
                      setProfileData((p) => ({ ...p, category: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>District</Label>
                  <Input
                    value={profileData.locationDistrict}
                    onChange={(e) =>
                      setProfileData((p) => ({
                        ...p,
                        locationDistrict: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={profileData.locationCity}
                    onChange={(e) =>
                      setProfileData((p) => ({
                        ...p,
                        locationCity: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData((p) => ({ ...p, bio: e.target.value }))
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Public Handle</Label>
                <Input
                  value={profileData.publicHandle}
                  onChange={(e) =>
                    setProfileData((p) => ({
                      ...p,
                      publicHandle: e.target.value,
                    }))
                  }
                />
              </div>

              <Button variant="outline" className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Identity Tab */}
        <TabsContent value="identity" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>NID Verification</CardTitle>
              <CardDescription>
                Verify your NID to increase credibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Verification Status */}
              {verificationStatus && (
                <div
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg",
                    verificationStatus.bg,
                  )}
                >
                  <verificationStatus.icon
                    className={cn("h-5 w-5", verificationStatus.color)}
                  />
                  <div>
                    <p className={cn("font-medium", verificationStatus.color)}>
                      Verification Status: {verificationStatus.label}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {verificationStatus.reviewerNote}
                    </p>
                  </div>
                </div>
              )}

              {/* Upload NID */}
              <div className="space-y-2">
                <Label>Upload NID</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNidFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="nid-upload"
                  />
                  <label htmlFor="nid-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">
                      {nidFile ? nidFile.name : "Click to upload NID"}
                    </p>
                  </label>
                </div>
              </div>

              {/* Upload Selfie */}
              <div className="space-y-2">
                <Label>Upload Selfie</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelfieFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="selfie-upload"
                  />
                  <label htmlFor="selfie-upload" className="cursor-pointer">
                    <Camera className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">
                      {selfieFile ? selfieFile.name : "Click to upload selfie"}
                    </p>
                  </label>
                </div>
              </div>

              <Button className="w-full sm:w-auto">
                <Shield className="h-4 w-4 mr-2" /> Submit for Verification
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Public Profile</p>
                  <p className="text-sm text-slate-500">
                    Others can view your profile
                  </p>
                </div>
                <Switch
                  checked={profileData.publicVisibility}
                  onCheckedChange={(checked) =>
                    setProfileData((p) => ({ ...p, publicVisibility: checked }))
                  }
                />
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <p className="font-medium">SMS Notifications</p>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <p className="font-medium">Confirmation Alerts</p>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <p className="font-medium">Dispute Alerts</p>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
