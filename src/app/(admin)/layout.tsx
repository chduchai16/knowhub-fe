import { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/admin/admin-sidebar";
import { AdminFooter } from "@/components/layout/admin/admin-footer";
import { UserProvider } from "@/shared/hooks/use-user";
import { cookies } from "next/headers";
import { AdminHeader } from "@/components/layout/admin/admin-header";
import { serverBackendUrl } from "@/shared/constants/server-environment";

export default async function Layout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  let user = null;

  if (token) {
    const res = await fetch(`${serverBackendUrl}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.ok) {
      user = await res.json();
    }
  }

  return (
    <UserProvider initialUser={user}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AdminSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col">
            <AdminHeader />
            <main className="flex-1 p-6">{children}</main>
            <AdminFooter />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
