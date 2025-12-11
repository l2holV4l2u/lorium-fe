"use client";

import { ErrorBanner } from "@components/custom/errorBanner";
import { Button } from "@components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { LoadPage } from "@components/layout/loadPage";

export function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Map Auth.js error codes to Thai messages
  const errorMessages: Record<string, string> = {
    AccessDenied: "ไม่พบบัญชีที่ใช้อีเมลนี้ กรุณาติดต่อแอดมิน",
    CredentialsSignin: "ไม่พบบัญชีที่ใช้อีเมลนี้ กรุณาติดต่อแอดมิน",
    OAuthSignin: "เกิดข้อผิดพลาดในการเชื่อมต่อกับ Google",
    OAuthCallback: "เกิดข้อผิดพลาดในการตรวจสอบข้อมูล",
    OAuthCreateAccount: "ไม่พบบัญชีที่ใช้อีเมลนี้ กรุณาติดต่อแอดมิน",
    EmailCreateAccount: "ไม่พบบัญชีที่ใช้อีเมลนี้ กรุณาติดต่อแอดมิน",
    Callback: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
    OAuthAccountNotLinked: "ไม่พบบัญชีที่ใช้อีเมลนี้ กรุณาติดต่อแอดมิน",
    EmailSignin: "ไม่สามารถส่งอีเมลได้",
    SessionRequired: "กรุณาเข้าสู่ระบบ",
    default: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
  };

  const errorParam = searchParams.get("error");
  const error = errorParam
    ? errorMessages[errorParam] || errorMessages.default
    : undefined;

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/host");
    }
  }, [status, session, router]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/host" });
    } catch (error) {
      console.error("Google Login Failed:", error);
      setIsLoading(false);
    }
  };

  // Show loading while checking session
  if (status === "loading")
    return (
      <div className="w-screen h-screen">
        <LoadPage />
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold text-gray-900">
                เข้าสู่ระบบ Loreum
              </div>
              <div className="text-gray-600">
                ลงชื่อเข้าใช้ด้วย Google Account
              </div>
            </div>
          </div>

          {/* Error Message */}
          <ErrorBanner error={error} />

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center p-2 gap-2">
              <LoaderCircle
                size={24}
                strokeWidth={2}
                className="animate-spin text-primary-500"
              />
              <span className="text-gray-600">กำลังเข้าสู่ระบบ...</span>
            </div>
          )}

          {/* Custom Google Login Button */}
          {!isLoading && (
            <div className="space-y-4">
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                size="full"
              >
                <FcGoogle size={20} />
                <div className="font-medium text-base">
                  เข้าสู่ระบบด้วย Google
                </div>
              </Button>
            </div>
          )}

          {/* Additional Help Text */}
          {error && (
            <div className="text-center text-sm text-gray-500 pt-2">
              หากคุณเป็นนักเรียนหรือครูใหม่ กรุณาติดต่อแอดมินเพื่อเพิ่มบัญชี
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
