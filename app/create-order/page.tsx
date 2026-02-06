"use client";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function CompleteProfilePage() {
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productQuantity: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    invoiceNumber: "",
    deliveryDate: undefined as Date | undefined,
  });

  const handleproofDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) setProof(file);
  };

  const handleProofSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProof(file);
  };

  const setProof = (file: File) => {
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const removeProof = () => {
    setProofFile(null);
    setProofPreview(null);
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const name = event.target.name;
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("proof", proofFile);
    console.log("proof", proofFile);
  };

  return (
    <main className="min-h-screen grid place-items-center px-4 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-50 via-emerald-100 to-emerald-200">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-emerald-700">
            Complete Your Order
          </CardTitle>
          <CardDescription>And create your shareable link</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Product Name</Label>
                <Input
                  name="productName"
                  value={form.productName}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="h-10"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Product Price</Label>
                <Input
                  type="number"
                  name="productPrice"
                  value={form.productPrice}
                  onChange={handleChange}
                  placeholder="Enter product price"
                  className="h-10"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Product Description</Label>
              <Textarea
                name="productDescription"
                value={form.productDescription}
                onChange={handleChange}
                placeholder="A short description about your product"
                rows={3}
                required
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Product Quantity</Label>
                <Input
                  name="productQuantity"
                  type="number"
                  value={form.productQuantity}
                  onChange={handleChange}
                  placeholder="1"
                  className="h-10"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Customer Name</Label>
                <Input
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="Customer Name"
                  className="h-10"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Customer Email</Label>
                <Input
                  name="customerEmail"
                  type="email"
                  value={form.customerEmail}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="h-10"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Customer Phone</Label>
                <Input
                  name="customerPhone"
                  value={form.customerPhone}
                  required
                  onChange={handleChange}
                  placeholder="+8801700000000"
                  className="h-10"
                />
              </div>
              <div className="grid gap-2">
                <Label>Customer Address</Label>
                <Input
                  name="customerAddress"
                  value={form.customerAddress}
                  required
                  onChange={handleChange}
                  placeholder="Dhaka, Bangladesh"
                  className="h-10"
                />
              </div>

              <div className="grid gap-2">
                <Label>Invoice Number</Label>
                <Input
                  name="invoiceNumber"
                  value={form.invoiceNumber}
                  required
                  onChange={handleChange}
                  placeholder="INV-5839-XXXX"
                  className="h-10"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Upload Invoice</label>

                <Input
                  type="file"
                  accept="image/*"
                  // onChange={handleImageChange}
                  required
                  className="file:border file:bg-emerald-600 file:text-white px-0 file:cursor-pointer cursor-pointer file:px-4 file:py-2 h-10 py-0  file:rounded-md"
                />

                {/* {false && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-md border"
                  />
                )} */}
              </div>
              <div className="grid gap-2">
                <Label>Delivery Date</Label>
                <DatePicker
                  date={form.deliveryDate}
                  setDate={(d) => setForm({ ...form, deliveryDate: d })}
                />
              </div>
            </div>

            {/* ---- proof Upload ---- */}
            <div className="grid gap-2">
              <Label>Proof of Delivery(Any)</Label>
              <div
                onDrop={handleproofDrop}
                onDragOver={(e) => e.preventDefault()}
                className={cn(
                  "rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-6 text-center transition",
                  "hover:border-emerald-400 hover:bg-emerald-100/60",
                )}
              >
                {proofPreview ? (
                  <div className="relative inline-block">
                    <Image
                      src={proofPreview}
                      height={40}
                      width={120}
                      alt="proof"
                      className="h-40 rounded-lg shadow"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={removeProof}
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
                    <Label
                      htmlFor="proof-upload"
                      className="mt-2 inline-flex h-8 items-center rounded-md bg-emerald-600 px-3 text-xs text-white hover:bg-emerald-700 cursor-pointer"
                    >
                      Select File
                    </Label>
                    <Input
                      id="proof-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProofSelect}
                    />
                  </>
                )}
              </div>
            </div>

            {/* ---- Submit ---- */}
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              Create Order
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
