"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, UploadCloud, X } from "lucide-react";
import { CardDescription, CardTitle, CardHeader } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Image from "next/image";
import toast from "react-hot-toast";
import { useUploadPhoto } from "@/app/hooks/useUploadPhoto";
import { useCreateBusiness } from "@/app/hooks/useBusinessMutaions";

export type BusinessForm = {
  businessName: string;
  businessType: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  businessWebsite: string;
  businessTradeLicense: string;
  businessWareHouse: string;
  businessStoreFrontLink: string;
  businessCategoryId: string;
};
const businessCategory = [
  { id: "1", category: "Retail" },
  { id: "2", category: "Wholesale" },
  { id: "3", category: "E-commerce" },
  { id: "4", category: "Manufacturing" },
  { id: "5", category: "Distributor" },
];
export default function BusinessFormPage() {
  const [form, setForm] = useState<BusinessForm>({
    businessName: "",
    businessType: "",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
    businessWebsite: "",
    businessTradeLicense: "",
    businessWareHouse: "",
    businessStoreFrontLink: "",
    businessCategoryId: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoURL, setLogoURL] = useState<string | null>(null);
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);
  const [tradeLicensePreview, setTradeLicensePreview] = useState<string>("");

  // hooks
  const uploadPhoto = useUploadPhoto();
  const createBusiness = useCreateBusiness();
  // handle logo
  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setLogoURL(previewUrl);
  };

  const handleChange =
    (key: keyof BusinessForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [key]: e.target.value });
    };

  const handleTradeLicenseDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) setTradeLicense(file);
  };

  const handleTradeLicenseSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setTradeLicense(file);
  };

  const setTradeLicense = (file: File) => {
    setTradeLicenseFile(file);
    setTradeLicensePreview(URL.createObjectURL(file));
  };

  const removeTradeLicense = () => {
    setTradeLicenseFile(null);
    setTradeLicensePreview("");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradeLicenseFile) {
      return toast.error("Trade License is required!");
    }

    const formData = new FormData();
    if (tradeLicenseFile) {
      formData.append("businessTradeLicense", tradeLicenseFile);
    }
    if (logoFile) {
      formData.append("businessLogo", logoFile);
    }

    // call post api for create business
    const data = await createBusiness.mutateAsync(form);

    // after completion post images
    if (data.success) {
      const uploadData = await uploadPhoto.mutateAsync({
        path: "user/upload-assets",
        file: formData,
      });
      console.log(uploadData);
      if (uploadData.id) {
        toast.success("Business Profile Created!");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-sm max-w-4xl mx-auto p-6 grid gap-8"
    >
      {/* Avatar Upload */}
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-emerald-700">
          Create Your Business Profile
        </CardTitle>
        <CardDescription>Help us get to know you better</CardDescription>
      </CardHeader>

      <div className="flex flex-col items-center gap-3">
        <Avatar className="h-24 w-24 ring-4 ring-emerald-100">
          <AvatarImage src={logoURL ?? ""} />
          <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
            {form.businessName?.slice(0, 2).toUpperCase() || "AA"}
          </AvatarFallback>
        </Avatar>

        <Label
          htmlFor="avatar-upload"
          className="cursor-pointer flex items-center gap-2 text-sm text-emerald-600 hover:underline"
        >
          <Camera className="h-4 w-4" />
          Upload Business Logo
        </Label>

        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatar}
        />
      </div>

      {/* Two Column Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* <div className="grid gap-2">
          <Label>Owner Name</Label>
          <Input
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Your Name"
            className="h-10"
          />
        </div> */}

        <div className="grid gap-2">
          <Label>Business Name</Label>
          <Input
            value={form.businessName}
            onChange={handleChange("businessName")}
            placeholder="ABC Corporation"
            className="h-10"
          />
        </div>

        <div className="grid gap-2">
          <Label>Business Type</Label>
          <Select
            value={form.businessType}
            onValueChange={(v) =>
              setForm((prev) => ({ ...prev, businessType: v }))
            }
          >
            <SelectTrigger className="w-full h-10">
              <SelectValue placeholder="Select Business Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WHOLESALE">Wholesale</SelectItem>
              <SelectItem value="RETAIL">Retail</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Business Category</Label>
          <Select
            value={form.businessCategoryId}
            onValueChange={(v) =>
              setForm((prev) => ({ ...prev, businessCategoryId: v }))
            }
          >
            <SelectTrigger className="w-full h-10">
              <SelectValue placeholder="Select Business Category" />
            </SelectTrigger>
            <SelectContent>
              {businessCategory.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Business Address</Label>
          <Input
            value={form.businessAddress}
            onChange={handleChange("businessAddress")}
            placeholder="Provide your business address"
            className="h-10"
          />
        </div>

        <div className="grid gap-2">
          <Label>Business Phone</Label>
          <Input
            value={form.businessPhone}
            onChange={handleChange("businessPhone")}
            className="h-10"
          />
        </div>

        <div className="grid gap-2">
          <Label>Business Email</Label>
          <Input
            type="email"
            value={form.businessEmail}
            onChange={handleChange("businessEmail")}
            className="h-10"
          />
        </div>

        <div className="grid gap-2">
          <Label>Website</Label>
          <Input
            value={form.businessWebsite}
            onChange={handleChange("businessWebsite")}
            className="h-10"
          />
        </div>

        <div className="grid gap-2">
          <Label>Warehouse</Label>
          <Input
            value={form.businessWareHouse}
            onChange={handleChange("businessWareHouse")}
            className="h-10"
          />
        </div>

        <div className="grid gap-2">
          <Label>Storefront Link</Label>
          <Input
            value={form.businessStoreFrontLink}
            onChange={handleChange("businessStoreFrontLink")}
            className="h-10"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Trade License</Label>
        <div
          onDrop={handleTradeLicenseDrop}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            "rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-6 text-center transition",
            "hover:border-emerald-400 hover:bg-emerald-100/60",
          )}
        >
          {tradeLicensePreview ? (
            <div className="relative inline-block">
              <Image
                src={tradeLicensePreview}
                height={40}
                width={120}
                alt="nid"
                className="h-40 rounded-lg shadow"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={removeTradeLicense}
                className="absolute -top-2 -right-2 rounded-full bg-white/80 hover:bg-white"
              >
                <X className="h-4 w-4 text-emerald-700" />
              </Button>
            </div>
          ) : (
            <div>
              <UploadCloud className="mx-auto h-10 w-10 text-emerald-500" />
              <p className="mt-2 text-sm text-emerald-700">
                Drag & drop or click to upload
              </p>
              <Label
                htmlFor="nid-upload"
                className="mt-2 inline-flex h-8 items-center rounded-md bg-emerald-600 px-3 text-xs text-white hover:bg-emerald-700 cursor-pointer"
              >
                Select File
              </Label>
              <input
                id="nid-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleTradeLicenseSelect}
              />
            </div>
          )}
        </div>
      </div>
      <Button
        type="submit"
        className="w-64 mx-auto bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        {createBusiness.isPending || uploadPhoto.isPending
          ? "Saving Info..."
          : "Save Business Profile"}
      </Button>
    </form>
  );
}
