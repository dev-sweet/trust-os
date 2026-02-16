"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLoginUser } from "@/hooks/useUserMutations";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Spinner from "@/components/shared/Spinner";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { mutate, isPending } = useLoginUser();
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: (data) => {
        toast.success(data.message || "Login successful");
        if (data?.user?.isEmailVerified) {
          router.push("/dashboard");
        } else {
          router.push(`/signup/verify-otp?uuid=${data?.user.uuid}`);
        }
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-50 via-emerald-100 to-emerald-200">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-emerald-700">
            Amar Astha
          </CardTitle>
          <CardDescription>
            Welcome back! Please login to continue.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="h-10"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="h-10"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2 rounded-lg  text-white cursor-pointer",
                isPending
                  ? "bg-emerald-500/50"
                  : "bg-emerald-600 hover:bg-emerald-700",
              )}
            >
              {isPending && <Spinner />} Login
            </button>
          </form>
        </CardContent>

        <CardFooter className="just]ify-center">
          <p className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-emerald-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
