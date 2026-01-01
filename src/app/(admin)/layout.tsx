import { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AdminHeader } from "@/features/admin/components/admin-header";
import { AdminFooter } from "@/features/admin/components/admin-footer";
import { UserProvider } from "@/shared/hooks/use-user";
import { cookies } from "next/headers";

export default async function Layout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  let user = null;

  if (token) {
    const res = await fetch("http://localhost:8080/api/auth/profile", {
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
