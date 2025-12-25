"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

export default function AuthTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const derive = (p?: string) => (p && p.includes("/register") ? "register" : "login");
  const [value, setValue] = useState<string>(derive(pathname));

  useEffect(() => {
    setValue(derive(pathname));
  }, [pathname]);

  const onChange = (v: string) => {
    setValue(v);
    if (v === "login") router.push("/login");
    else if (v === "register") router.push("/register");
  };

  return (
    <div className="w-full max-w-lg bg-white p-6">
      <Tabs value={value} onValueChange={onChange}>
        <TabsList>
          <TabsTrigger value="login" className={value === "login" ? "text-blue-500 font-bold" : ""}>Đăng nhập</TabsTrigger>
          <TabsTrigger value="register" className={value === "register" ? "text-blue-500 font-bold" : ""}>Đăng ký</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
