"use client";

import React, { useState } from "react";
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
import { useGetLinkInfo, useSubmitReview } from "@/hooks/useReviewMutations";
import { useParams } from "next/navigation";
import Loader from "@/components/shared/Loader";
import Link from "next/link";
import toast from "react-hot-toast";

type ReviewType =
  | "COMPLETED_AS_AGREED"
  | "COMPLETED_WITH_ISSUE"
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

  const { data, isPending } = useGetLinkInfo(uuid);
  const { mutate, isPending: isPendingSubmit } = useSubmitReview();

  // handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      toast.error("Must be select a review card");
      return;
    }

    if (selected !== "COMPLETED_AS_AGREED" && !complaint) {
      toast.error("Please tell us your issue.");
      return;
    }
    const formData = new FormData();

    formData.append("review", selected);
    formData.append("orderUuid", uuid);

    if (complaint) {
      formData.append("complain", complaint);
    }
    if (imageFile) {
      formData.append("attachment", imageFile);
    }

    mutate(formData);
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
          Go Home
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
    <div className="max-w-3xl  mx-auto p-6 space-y-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Amr Astha
        </h1>
        <p className="text-gray-500 mt-2  mx-auto font-semibold">
          Your review helps build trust in our marketplace. Whether your
          experience was positive or negative, honest feedback matters.
        </p>
      </div>
      {/* order info */}
      <div className="bg-gray-200/20 p-6 text-white rounded-lg">
        <div className="flex items-center gap-2 text-emerald-400 mb-4">
          <Info size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">
            Order Verification
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">
              Invoice
            </p>
            <p className="text-sm font-bold text-emerald-400">
              INV-{data.orderDetails.invoiceNumber}
            </p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <p className="text-[10px] text-gray-400 uppercase font-bold">
              Product
            </p>
            <p className="text-sm text-emerald-400 font-medium truncate">
              {data.orderDetails.productName}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">
              Total
            </p>
            <p className="text-sm font-bold text-emerald-400">
              ${data.orderDetails.productPrice}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">
              Order Date:
            </p>
            <p className="text-sm font-bold text-emerald-400">
              {new Date(data.orderDetails.orderDate).toDateString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">
              Delivery Date:
            </p>
            <p className="text-sm font-bold text-emerald-400">
              {new Date(data.orderDetails.deliveryDate).toDateString()}
            </p>
          </div>
        </div>
      </div>
      <p className="mb-4 text-gray-800">
        Take a moment to share how your transaction went. Whether it was smooth
        or had issues, your feedback keeps our marketplace trustworthy for
        everyone.
      </p>

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
          onClick={() => setSelected("COMPLETED_WITH_ISSUE")}
          className={cn(
            "border border-gray-300 md:rounded-xl rounded-md md:p-6 p-2 text-center hover:border-yellow-300 hover:bg-yellow-50  transition-all duration-200",
            selected === "COMPLETED_WITH_ISSUE" &&
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
        {(selected === "COMPLETED_WITH_ISSUE" ||
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
          {isPendingSubmit ? "Submitting Review..." : " Submit Review"}
        </button>
      </form>
    </div>
  );
}
