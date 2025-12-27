"use client";

import { ReactNode, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminFooter } from "./AdminFooter";

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
                <main className="flex-1 p-6 overflow-x-hidden">
                    {children}
                </main>
                <AdminFooter />
            </div>
        </div>
    );
}
