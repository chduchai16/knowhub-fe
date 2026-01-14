'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Bell,
  User,
  PlusSquare,
  LogOut,
  Search,
  Menu,
} from 'lucide-react';
import { SearchSheet } from './search-sheet';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useUser } from '@/shared/hooks/use-user';
import { Button } from '@/shared/components/ui/button';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const navigationItems = [
  {
    title: 'Trang chủ',
    url: '/feed',
    icon: Home,
  },
  {
    title : 'Tìm kiếm' ,
    url : '/search',
    icon : Search
  },
  {
    title: 'Khám phá',
    url: '/explore',
    icon: Compass,
  },
  {
    title: 'Thông báo',
    url: '/notifications',
    icon: Bell,
  },
  {
    title: 'Hồ sơ',
    url: '/profile',
    icon: User,
  },
  {
    title: 'Tạo bài viết',
    url: '/post/create',
    icon: PlusSquare,
  },
  {
    title: 'Cài đặt',
    url: '/settings',
    icon: Menu,
  },
];

export function ClientSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
    router.refresh();
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
              <Avatar className="w-full h-full bg-transparent">
                  <AvatarImage
                      src={'/assets/knowhub-logo.png'}
                      alt="KnowHub Logo"
                      className="object-contain p-1"
                  />
                  <AvatarFallback className="bg-transparent text-white font-bold text-xs">KH</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <span
            className="text-2xl"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            KnowHub
          </span>

        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="!gap-3">
              {navigationItems.map((item) => {
                const isActive = pathname === item.url || pathname?.startsWith(item.url + '/');
                
                if (item.title === 'Tìm kiếm') {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SearchSheet>
                        <SidebarMenuButton className="text-sm py-5 px-3 font-medium cursor-pointer">
                          <item.icon className="!w-6 !h-6" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SearchSheet>
                    </SidebarMenuItem>
                  );
                }
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} className="text-sm py-5 px-3 font-medium">
                      <Link href={item.url}>
                        <item.icon className="!w-6 !h-6" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {user && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatarUrl || undefined} alt={user.fullName || 'User'} />
                <AvatarFallback>{user.fullName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium truncate">{user.fullName}</p>
                <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
