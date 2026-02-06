"use client";

import React, { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  X,
  UploadCloud,
  MessageSquare,
  ImageIcon,
  BadgeCheck,
  TriangleAlert,
  ShieldBan,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ReviewType =
  | "COMPLETED_AS_AGREED"
  | "COMPLETED_WITH_AN_ISSUE"
  | "NOT_COMPLETED";

export default function ReviewPage() {
  const [selected, setSelected] = useState<ReviewType | null>(null);
  const [complaint, setComplaint] = useState("");
  const [nidFile, setNidFile] = useState<File | null>(null);
  const [nidPreview, setNidPreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      selected,
      complaint,
      //   image,
    });

    alert("Review Submitted!");
  };

  const handleNidDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) setNid(file);
  };

  const handleNidSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNid(file);
  };

  const setNid = (file: File) => {
    setNidFile(file);
    setNidPreview(URL.createObjectURL(file));
  };

  const removeNid = () => {
    setNidFile(null);
    setNidPreview(null);
  };
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h2 className="text-xl font-semibold">
        How do you feel about our service?
      </h2>

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
                <MessageSquare /> Complaint
              </Label>

              <Textarea
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                className="w-full border rounded-md p-2 min-h-25"
                placeholder="Tell us what went wrong..."
              />
            </div>

            <Label htmlFor="nid-upload" className="grid gap-2  cursor-pointer">
              <label className="font-medium flex items-center gap-2">
                <ImageIcon /> Upload Image
              </label>
              <div
                onDrop={handleNidDrop}
                onDragOver={(e) => e.preventDefault()}
                className={cn(
                  "rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-6 text-center transition",
                  "hover:border-emerald-400 hover:bg-emerald-100/60",
                )}
              >
                {nidPreview ? (
                  <div className="relative inline-block">
                    <Image
                      src={nidPreview}
                      height={40}
                      width={120}
                      alt="nid"
                      className="h-40 rounded-lg shadow"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={removeNid}
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
                      id="nid-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleNidSelect}
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
