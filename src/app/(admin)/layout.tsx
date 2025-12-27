import { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AdminHeader } from "@/features/admin/components/admin-header";
import { AdminFooter } from "@/features/admin/components/admin-footer";

export default function Layout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
                    <AdminHeader />
                    <main className="flex-1 p-6 overflow-x-hidden">
                        {children}
                    </main>
                    <AdminFooter />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
