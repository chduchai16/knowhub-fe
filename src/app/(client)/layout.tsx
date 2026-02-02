import { ReactNode } from 'react';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { ClientHeader } from '@/components/layout/client/client-header';
import { UserProvider } from '@/shared/hooks/use-user';
import { cookies } from 'next/headers';
import { User } from '@/features/user/models/user';
import { ClientSidebar } from '@/components/layout/client/client-sidebar';
import { redirect } from 'next/navigation';

export default async function ClientLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();

  const token = cookieStore.get('token')?.value;
  const sidebarState = cookieStore.get('sidebar_state')?.value;
  const defaultOpen = false; // Always start collapsed as per user request
  let user : User | null = null;

  if (token) {
    try {
      const res = await fetch('http://localhost:8080/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      });

      if (res.ok) {
        const response = await res.json();
        user = response.data;
      } else {
        cookieStore.delete('token');
        redirect('/login');
      }
    } catch (error) {
      cookieStore.delete('token');
      redirect('/login');
    }
  }

  return (
    <UserProvider initialUser={user}>
      <SidebarProvider defaultOpen={defaultOpen} suppressHydrationWarning>
        <ClientSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col min-h-screen">
            <ClientHeader />
            <main className="flex-1 p-4 lg:p-6">
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
