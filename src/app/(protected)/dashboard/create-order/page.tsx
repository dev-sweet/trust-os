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
import { useUploadPhoto } from "@/hooks/useUploadPhoto";
import { useCreateOrder } from "@/hooks/useOrderMutations";
import toast from "react-hot-toast";

// for dialog
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Check,
  Copy,
  Link2,
  MessageCircle,
  Mail,
  Twitter,
  Send,
  MoreHorizontal,
  ShieldCheck,
} from "lucide-react";

// types

export interface OrderForm {
  orderDate: string;
  productName: string;
  productDescription: string;
  productPrice: string;
  productQuantity: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  invoiceNumber: string;
  invoiceUrl: string;
  profOfDelivery: string;
  deliveryDate: Date | null | string;
}
export default function CreateOrder() {
  // files
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<File | null>(null);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState("");
  const [copied, setCopied] = useState(false);

  // form
  const [form, setForm] = useState<OrderForm>({
    orderDate: new Date().toISOString(),
    productName: "",
    productDescription: "",
    productPrice: "",
    productQuantity: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    invoiceNumber: "",
    invoiceUrl: "",
    profOfDelivery: "",
    deliveryDate: null,
  });

  const uploadPhoto = useUploadPhoto();
  const createOrder = useCreateOrder();

  // handle drag & drop and file input
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

  // handle image of invoice
  const handleInvoiceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const invoiceFile = event.target.files?.[0];
    setInvoice(invoiceFile as File);
    console.log(invoiceFile);
  };

  // on form element change event
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const name = event.target.name;
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // on form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createOrder.mutateAsync({
      ...form,
      deliveryDate:
        form.deliveryDate instanceof Date
          ? form.deliveryDate.toISOString()
          : (form.deliveryDate ?? null),
    });

    if (result.success) {
      const formData = new FormData();
      formData.append("invoiceFiles", invoice as File);
      formData.append("profOfDeliveryFiles", proofFile as File);

      const data = await uploadPhoto.mutateAsync({
        path: `user/upload-assets?orderId=${result?.data?.order?.id}`,
        file: formData,
      });

      if (data) {
        setIsModalOpen(true);
        setShareableLink(
          `http://localhost:300/shared-links/${result.data.link.link}`,
        );
      }
    }
  };

  // Copy link to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  // Share via social links
  const encodedLink = encodeURIComponent(shareableLink);
  const encodedTitle = encodeURIComponent("Check out this link!");

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-emerald-600 hover:bg-emerald-500",
      url: `https://wa.me/?text=${encodedTitle}%20${encodedLink}`,
    },
    {
      name: "SMS",
      icon: Mail,
      color: "bg-gray-700 hover:bg-gray-600",
      url: `mailto:?subject=${encodedTitle}&body=${encodedLink}`,
    },
  ];

  const handleShare = (option: (typeof shareOptions)[0]) => {
    window.open(option.url, "_blank", "noopener,noreferrer");
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
                  onChange={handleInvoiceChange}
                  required
                  className="file:border file:bg-emerald-600 file:text-white px-0 file:cursor-pointer cursor-pointer file:px-4 file:py-2 h-10 py-0  file:rounded-md"
                />
              </div>
              <div className="grid gap-2">
                <Label>Delivery Date</Label>
                <DatePicker
                  date={form.deliveryDate as Date}
                  setDate={(d) => setForm({ ...form, deliveryDate: d as Date })}
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
      <Dialog
        // style={{ overflow: "hidden" }}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <DialogContent className="md:w-84 w-sm overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>
              <div className="flex justify-center">
                <ShieldCheck size="100" className="text-emerald-700" />
              </div>{" "}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="w-full min-w-0 overflow-hidden">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Your link is ready!
            </h1>

            <p className="text-center text-emerald-500 mb-4">
              Share this link with anyone you like
            </p>
            <div className="text-center">
              <div className="flex justify-center gap-3 flex-wrap">
                {shareOptions.map((option) => (
                  <Button
                    key={option.name}
                    onClick={() => handleShare(option)}
                    className={`w-14 h-14 rounded-2xl p-0 ${option.color} text-white shadow-md transition-all hover:scale-105 hover:shadow-lg`}
                    title={`Share via ${option.name}`}
                  >
                    <option.icon className="w-6 h-6" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Copy Button */}
            <div className="text-center">
              <Button
                onClick={handleCopy}
                className="mt-8 w-28 h-10 bg-linear-to-r text-xs from-emerald-600 to-emerald-700 text-white font-medium rounded-lg shadow-lg hover:opacity-90 transition-opacity mb-8"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" /> Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
