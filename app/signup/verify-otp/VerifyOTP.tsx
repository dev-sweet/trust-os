"use client";
import { useState, useRef, FormEvent, useEffect, Suspense } from "react";
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
import { useRequestOTP, useVerifyOTP } from "@/app/hooks/useOtpMutation";
import { useSearchParams } from "next/navigation";
// interface PageProps {
//   searchParams: { uuid?: string };
// }

export default function VerifyOtpPage() {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid");
  console.log("uuid", uuid);
  const useOTPRequest = useRequestOTP();
  const useOTPVerify = useVerifyOTP();

  // on change input field
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  //   on press key
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  // when paste otp
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("Text").trim();
    if (!/^\d+$/.test(paste)) return; // only digits

    const pasteDigits = paste.split("").slice(0, 6);
    const newDigits = [...digits];
    pasteDigits.forEach((d, i) => {
      newDigits[i] = d;
      if (inputs.current[i]) {
        inputs.current[i]!.value = d;
      }
    });
    setDigits(newDigits);

    // focus the next empty input
    const firstEmptyIndex = newDigits.findIndex((d) => d === "");
    if (firstEmptyIndex !== -1) {
      inputs.current[firstEmptyIndex]?.focus();
    } else {
      // all filled, blur last
      inputs.current[5]?.blur();
    }
  };

  // submit otp
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (uuid) {
      useOTPVerify.mutate({ uuid, code });
    }
  };

  // resend otp
  const resendOTP = async () => {
    if (uuid) {
      useOTPRequest.mutate({ uuid });
    }
  };

  // request otp
  useEffect(() => {
    if (uuid) {
      useOTPRequest.mutate({ uuid });
    }
  });

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-50 via-emerald-100 to-emerald-200">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-emerald-700">
            Amar Astha
          </CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-2">
              <Label>One-Time Password</Label>
              <div className="flex justify-between gap-2">
                {digits.map((d, i) => (
                  <Input
                    key={i}
                    ref={(el) => {
                      inputs.current[i] = el;
                    }}
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className="h-12 w-12 text-center text-lg rounded-md"
                    required
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {useOTPVerify.isPaused ? "Verifying" : "Verify"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <div className="text-sm text-muted-foreground">
            Didn’t receive the code?{" "}
            <button
              type="button"
              onClick={resendOTP}
              className="text-emerald-600 hover:underline font-medium"
            >
              Resend OTP
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
