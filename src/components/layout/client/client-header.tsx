'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';

export function ClientHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 lg:hidden">
      <SidebarTrigger>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SidebarTrigger>
      
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <span className="text-white font-bold">K</span>
        </div>
        <span className="font-semibold">KnowHub</span>
      </div>
    </header>
  );
}
