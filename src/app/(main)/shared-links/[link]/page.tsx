"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  UploadCloud,
  MessageSquare,
  ImageIcon,
  BadgeCheck,
  TriangleAlert,
  ShieldBan,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetLinkInfo } from "@/hooks/useReviewMutations";
import { useParams } from "next/navigation";
import Loader from "@/components/shared/Loader";
import Link from "next/link";

type ReviewType =
  | "COMPLETED_AS_AGREED"
  | "COMPLETED_WITH_AN_ISSUE"
  | "NOT_COMPLETED";

export default function ReviewPage() {
  // form states
  const [selected, setSelected] = useState<ReviewType | null>(null);
  const [complaint, setComplaint] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // link state

  const params = useParams();

  const linkText = params?.link as string;
  const uuid = linkText.split("-").slice(0, 5)?.join("-");

  console.log("uuid", uuid);
  const { data, isPending } = useGetLinkInfo(uuid);
  console.log(data);
  // handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("review", selected as string);
    formData.append("complain", complaint as string);
    formData.append("attachment", imageFile as File);
    // console.log({
    //   selected,
    //   complaint,
    //   imageFile,
    // });

    console.log("formData", formData);
    alert("Review Submitted!");
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) setImage(file);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const setImage = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  if (isPending) {
    return <Loader />;
  }
  if (data.isAlreadyReviewed) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-emerald-600 font-medium">
          You have already submitted a review. Thank you!
        </p>
        <button className="btn bg-emerald-500 p-2 rounded-md text-white hover:bg-emerald-700 cursor-pointer mt-5">
          Go to Home
        </button>
      </div>
    );
  }
  if (data.expiredLink) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-emerald-600 font-medium">
          Hi! It looks like the review link for your order{" "}
          <strong>#{data.orderDetails.invoiceNumber}</strong> has expired.
        </p>
        <Link
          href="/"
          className="btn bg-emerald-500 p-2 rounded-md text-white hover:bg-emerald-700 cursor-pointer mt-5 font-bold"
        >
          Go Home
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <p className="mb-4 text-gray-800">
        Help us maintain a trustworthy platform by sharing your experience.
        Honest feedback builds confidence for everyone.
      </p>
      <div className="w-full  bg-gray-50 p-5 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-2 mb-3 text-gray-400">
          <Info size={16} />
          <span className="text-[10px] uppercase tracking-widest font-bold">
            Order Details
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Invoice Number:</span>
            <span className="text-sm font-mono text-gray-800">
              {data.orderDetails.invoiceNumber}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Product:</span>
            <span className="text-sm font-medium text-gray-800">
              {data.orderDetails.productName}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
            <span className="text-xs text-gray-500">Description:</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">
              {data.orderDetails.productDescription}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
            <span className="text-xs text-gray-500">Quantity:</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">
              {data.orderDetails.productQuantity}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
            <span className="text-xs text-gray-500">Price per item:</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">
              ${data.orderDetails.productPrice}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
            <span className="text-xs text-gray-500">Order Date:</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">
              ${data.orderDetails.orderDate}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
            <span className="text-xs text-gray-500">Delivery Date:</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">
              ${data.orderDetails.deliveryDate}
            </span>
          </div>
        </div>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setSelected("COMPLETED_AS_AGREED")}
          className={cn(
            "border border-gray-300 md:rounded-xl rounded-md  md:p-6 p-2 text-center hover:border-emerald-300 hover:bg-emerald-50  transition-all duration-200",
            selected === "COMPLETED_AS_AGREED" &&
              "border-emerald-600 bg-emerald-50 text-emerald-600",
          )}
        >
          <BadgeCheck className="mx-auto mb-3 size-7 text-emerald-600" />
          <p className="font-semibold md:text-sm text-xs">Completed as Agree</p>
        </button>
        <button
          type="button"
          onClick={() => setSelected("COMPLETED_WITH_AN_ISSUE")}
          className={cn(
            "border border-gray-300 md:rounded-xl rounded-md md:p-6 p-2 text-center hover:border-yellow-300 hover:bg-yellow-50  transition-all duration-200",
            selected === "COMPLETED_WITH_AN_ISSUE" &&
              "border-yellow-500 bg-yellow-50 text-yellow-500",
          )}
        >
          <TriangleAlert className="mx-auto mb-3 size-7 text-yellow-500" />
          <p className="md:text-sm text-xs font-semibold">
            Completed with an Issue
          </p>
        </button>
        <button
          type="button"
          onClick={() => setSelected("NOT_COMPLETED")}
          className={cn(
            "border border-gray-300 md:rounded-xl rounded-md md:p-6 p-2 text-center hover:border-red-300 hover:bg-red-50 transition-all duration-200",
            selected === "NOT_COMPLETED" &&
              "border-red-500 bg-red-50 text-red-600",
          )}
        >
          <ShieldBan className="mx-auto mb-3 size-7 text-red-600" />
          <p className="md:text-sm text-xs font-semibold">Not Completed</p>
          {/* <p className="text-sm text-muted-foreground mt-1">Not Recieved</p> */}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl">
        {/* Conditional fields */}
        {(selected === "COMPLETED_WITH_AN_ISSUE" ||
          selected === "NOT_COMPLETED") && (
          <>
            <div className="space-y-2">
              <Label className="font-medium flex items-center gap-2">
                <MessageSquare /> Describe Your Issue
              </Label>

              <Textarea
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                className="w-full border rounded-md p-2 min-h-25"
                placeholder="Tell us what went wrong..."
              />
            </div>

            <Label
              htmlFor="image-upload"
              className="grid gap-2  cursor-pointer"
            >
              <label className="font-medium flex items-center gap-2">
                <ImageIcon /> Upload Image
              </label>
              <div
                onDrop={handleImageDrop}
                onDragOver={(e) => e.preventDefault()}
                className={cn(
                  "rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-6 text-center transition",
                  "hover:border-emerald-400 hover:bg-emerald-100/60",
                )}
              >
                {imagePreview ? (
                  <div className="relative inline-block">
                    <Image
                      src={imagePreview}
                      height={40}
                      width={120}
                      alt="image"
                      className="h-40 rounded-lg shadow"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 rounded-full bg-white/80 hover:bg-white"
                    >
                      <X className="h-4 w-4 text-emerald-700" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="mx-auto h-10 w-10 text-emerald-500" />
                    <p className="mt-2 text-sm text-emerald-700">
                      Drag & drop or click to upload
                    </p>
                    <Label className="mt-2 inline-flex h-8 items-center rounded-md px-3 text-xs text-gray-600">
                      PNG, JPG, JPEG or GIF
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </>
                )}
              </div>
            </Label>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition cursor-pointer"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
