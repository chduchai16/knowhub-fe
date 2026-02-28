"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { Button } from "@/shared/components/ui/button";

import { Facebook, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { registerSchema, RegisterSchema } from "../schemas/register-schema";
import { AuthService } from "../services/auth.service";
import { backendUrl } from "@/shared/constants/environment";

const googleOAuthUrl = backendUrl.replace(/\/api$/, "") + "/oauth2/authorization/google";
const facebookOAuthUrl = backendUrl.replace(/\/api$/, "") + "/oauth2/authorization/facebook";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: RegisterSchema) => {
    try {
      setIsLoading(true);
      const response = await AuthService.register(values);
      
      if (response) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        router.push("/login");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-extrabold mb-2">
        Tạo tài khoản mới
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Tạo tài khoản để bắt đầu kết nối với cộng đồng.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên đăng nhập</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      {...field}
                      placeholder="username"
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      {...field}
                      type="email"
                      placeholder="email@example.com"
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            className="w-full rounded-lg py-3 font-semibold text-white bg-blue-500 hover:bg-sky-700"
            disabled={!form.formState.isValid || isLoading}
          >
            {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản →"}
          </Button>
        </form>
      </Form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <div className="text-xs text-muted-foreground">
          HOẶC TIẾP TỤC VỚI
        </div>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Social */}
      <div className="grid grid-cols-2 gap-3">
        <a
          href={googleOAuthUrl}
          className="rounded-lg border border-gray-200 py-2 flex items-center justify-center gap-2 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </a>
        <a
          href={facebookOAuthUrl}
          className="rounded-lg border border-gray-200 py-2 flex items-center justify-center gap-2 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors"
        >
          <Facebook className="w-4 h-4 text-blue-600" />
          Facebook
        </a>
      </div>
    </div>
  );
}
