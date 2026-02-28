"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/shared/models/jwt-payload";

export default function OAuthSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // Set cookie để middleware và server layout có thể đọc
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const expiresAt = new Date(decoded.exp * 1000);
        Cookies.set("token", token, {
          expires: expiresAt,
          secure: false,
          sameSite: "Lax",
          path: "/",
        });
      } catch {
        // Nếu decode thất bại, set cookie không có expiry
        Cookies.set("token", token, { path: "/" });
      }

      router.push("/");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Image
            src="/assets/logo-svg.svg"
            alt="KnowHub"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <span className="text-2xl font-bold text-gray-800">KnowHub</span>
      </div>

      {/* Spinner */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      </div>

      {/* Text */}
      <div className="text-center space-y-1">
        <p className="text-base font-semibold text-gray-800">Đang đăng nhập...</p>
        <p className="text-sm text-gray-400">Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  );
}