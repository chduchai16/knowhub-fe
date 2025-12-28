import { cookies } from "next/headers";
import { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AdminHeader } from "@/features/admin/components/admin-header";
import { AdminFooter } from "@/features/admin/components/admin-footer";

export default async function Layout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
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
