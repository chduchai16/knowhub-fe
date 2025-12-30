"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { Button } from "@/shared/components/ui/button";

import {
  Globe,
  Facebook,
  Eye,
  EyeOff,
  User,
  Lock,
} from "lucide-react";

import { loginSchema, LoginSchema } from "../schemas/login-schema";
import { AuthService } from "../services/auth.service";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter() ;
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: LoginSchema) => {
    const token = await AuthService.login(values);
    if(token) {
      router.push("/");
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-extrabold mb-2">
        Chào mừng trở lại!
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Vui lòng nhập thông tin chi tiết của bạn để đăng nhập.
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
                      type="text"
                      placeholder="user@example.com"
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
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember */}
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <div className="flex items-center justify-between mt-2 ml-1">
                <label className="inline-flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={!!field.value}
                    onChange={(e) =>
                      field.onChange(e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm text-slate-700">
                    Ghi nhớ đăng nhập
                  </span>
                </label>

                <a className="text-sky-600 hover:underline cursor-pointer text-sm">
                  Quên mật khẩu?
                </a>
              </div>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            className="w-full rounded-lg py-3 font-semibold text-white bg-blue-500 hover:bg-sky-700"
          >
            Đăng nhập →
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
        <button className="rounded-lg border border-gray-200 py-2 flex items-center justify-center gap-2 hover:bg-gray-100">
          <Globe className="w-4 h-4 text-gray-600" />
          Google
        </button>
        <button className="rounded-lg border border-gray-200 py-2 flex items-center justify-center gap-2 hover:bg-gray-100">
          <Facebook className="w-4 h-4 text-blue-600" />
          Facebook
        </button>
      </div>

      <p className="text-xs text-center text-muted-foreground mt-6">
        Bằng cách đăng nhập, bạn đồng ý với Điều khoản và Chính sách
        quyền riêng tư của chúng tôi.
      </p>
    </div>
  );
}
