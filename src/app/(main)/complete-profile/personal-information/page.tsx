"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DatePicker } from "@/components/ui/date-picker";
import { Camera, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import toast from "react-hot-toast";
import { useGetUser, useUpdateUser } from "@/app/hooks/useUserMutations";
import { useUploadPhoto } from "@/app/hooks/useUploadPhoto";

export default function CompleteProfilePage() {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [nidFile, setNidFile] = useState<File | null>(null);
  const [nidPreview, setNidPreview] = useState<string | null>(null);

  const { data: userData, isLoading } = useGetUser();
  console.log(userData);
  const uploadPhoto = useUploadPhoto();
  const updateUser = useUpdateUser();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: undefined as Date | undefined,
    gender: "",
    country: "",
    website: "",
    bio: "",
  });

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatar(file);
    setAvatarURL(URL.createObjectURL(file));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nidFile && !avatar)
      return toast.error("Profile Photo & NID is Require!");

    if (avatar && nidFile) {
      const formData = new FormData();
      formData.append("profileImage", avatar);
      formData.append("nidImage", nidFile);
      const data = await uploadPhoto.mutateAsync({
        path: "user/upload-assets",
        file: formData,
      });

      if (data.id) {
        const user = {
          name: form.name,
          phone: form.phone,
          address: form.address,
        };

        updateUser.mutate(user);
      }
    }
  };
  useEffect(() => {
    const setData = async () => {
      if (await userData?.success) {
        setForm((prev) => {
          return {
            ...prev,
            name: userData?.data.name,
            email: userData?.data.email,
            phone: userData?.data.phone,
          };
        });
      }
    };
    setData();
  }, [userData]);
  return (
    <main className="min-h-screen grid place-items-center px-4 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-50 via-emerald-100 to-emerald-200">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-emerald-700">
            Complete Your Profile
          </CardTitle>
          <CardDescription>Help us get to know you better</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-5">
            {/* ---- Avatar ---- */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-24 w-24 ring-4 ring-emerald-100">
                <AvatarImage src={avatarURL ?? ""} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                  {form.name.slice(0, 2).toUpperCase() || "AA"}
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor="avatar-upload"
                className="cursor-pointer flex items-center gap-2 text-sm text-emerald-600 hover:underline"
              >
                <Camera className="h-4 w-4" />
                Upload photo
              </Label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatar}
              />
            </div>

            {/* ---- Name & Email ---- */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Full Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="h-10"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  disabled
                  placeholder="example@email.com"
                  className="bg-gray-100 h-10"
                  required
                />
              </div>
            </div>

            {/* ---- Phone & Address ---- */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+880 18XXXXXXXX"
                  className="h-10"
                />
              </div>
              <div className="grid gap-2">
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Your city, street..."
                  className="h-10"
                />
              </div>
            </div>

            {/* ---- Bio ---- */}
            {/* <div className="grid gap-2">
              <Label>Profile Description</Label>
              <Textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="A short description about yourself"
                rows={3}
              />
            </div> */}

            {/* ---- Date of Birth & Website ---- */}
            {/* <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Date of Birth</Label>
                <DatePicker
                  date={form.dob}
                  setDate={(d) => setForm({ ...form, dob: d })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Website (optional)</Label>
                <Input
                  type="url"
                  value={form.website}
                  onChange={(e) =>
                    setForm({ ...form, website: e.target.value })
                  }
                  placeholder="https://example.com"
                  className="h-10"
                />
              </div>
            </div> */}

            {/* ---- NID Upload ---- */}
            <div className="grid gap-2">
              <Label>NID Card</Label>
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
                      onChange={handleNidSelect}
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
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
