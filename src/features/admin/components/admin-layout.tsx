"use client";

import { ReactNode, useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { AdminFooter } from "./admin-footer";

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen w-full bg-neutral-50 dark:bg-neutral-900">
            <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
            <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
                <AdminHeader />
                <div className="flex-1 p-6 overflow-x-hidden">
                    {children}
                </div>
                <AdminFooter />
            </div>
        </div>
    );
}
