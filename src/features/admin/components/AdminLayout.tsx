import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminFooter } from "./AdminFooter";

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="flex min-h-screen w-full bg-neutral-50 dark:bg-neutral-900">
            <AdminSidebar />
            <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out md:ml-0">
                <AdminHeader />
                <main className="flex-1 p-6 overflow-x-hidden">
                    {children}
                </main>
                <AdminFooter />
            </div>
        </div>
    );
}
