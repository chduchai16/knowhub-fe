"use client";

import { Bell, Search, Calendar } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { useEffect, useState } from "react";
import { AdminBreadcrumb } from "@/components/common/admin/admin-breadcrumb";

export function AdminHeader() {
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const now = new Date();
        const formattedDate = new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(now);
        setCurrentDate(formattedDate);
    }, []);

    return (
        <header className="flex h-16 items-center border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 sticky top-0 z-10 w-full transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 shadow-sm">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-2 hidden md:block" />
                <AdminBreadcrumb />
            </div>

            <div className="flex flex-1 items-center justify-end gap-4">
                <form className="hidden lg:block">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                        <Input
                            type="search"
                            placeholder="Nhập chuỗi tìm kiếm ..."
                            className="w-full rounded-lg bg-neutral-100 dark:bg-neutral-800 pl-8 md:w-[200px] lg:w-[320px]"
                        />
                    </div>
                </form>
            </div>
            <div className="flex items-center gap-4 ml-5">
                <Button variant="ghost" size="icon" className="text-neutral-500">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>

                <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 mx-2" />

                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                    <Calendar className="h-4 w-4" />
                    <span>{currentDate}</span>
                </div>
            </div>
        </header>
    );
}
