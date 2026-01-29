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
  MessageSquare,
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
  useSidebar,
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
    title: 'Tin nhắn',
    url: '/messages',
    icon: MessageSquare,
  },
  {
    title: 'Tạo bài viết',
    url: '/post/create',
    icon: PlusSquare,
  },
  {
    title: 'Hồ sơ',
    url: '/profile',
    icon: User,
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
  const { setOpen, state } = useSidebar();

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
    router.refresh();
  };

  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar 
      collapsible="icon"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="transition-all duration-300 ease-in-out"
    >
      <SidebarHeader className={`border-b py-6 transition-all duration-300 ${isCollapsed ? 'px-0' : 'px-5'}`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex-shrink-0 flex items-center justify-center">
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
          {!isCollapsed && (
            <span
              className="text-2xl whitespace-nowrap overflow-hidden transition-all duration-300"
              style={{ fontFamily: "var(--font-pacifico)" }}
            >
              KnowHub
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className={isCollapsed ? 'px-0' : 'px-2'}>
          <SidebarGroupContent>
            <SidebarMenu className={`!gap-3 ${isCollapsed ? 'items-center' : ''}`}>
              {navigationItems.map((item) => {
                const isActive = pathname === item.url || pathname?.startsWith(item.url + '/');
                
                if (item.title === 'Tìm kiếm') {
                  return (
                    <SidebarMenuItem key={item.title} className="w-full flex justify-center">
                      <SearchSheet>
                        <SidebarMenuButton className={`text-sm py-5 px-3 font-medium cursor-pointer transition-colors hover:bg-muted bg-transparent ${isCollapsed ? 'justify-center !px-0 !w-10' : ''}`}>
                          <item.icon className="!w-6 !h-6 flex-shrink-0" />
                          {!isCollapsed && <span className="ml-3">{item.title}</span>}
                        </SidebarMenuButton>
                      </SearchSheet>
                    </SidebarMenuItem>
                  );
                }
                
                return (
                  <SidebarMenuItem key={item.title} className="w-full flex justify-center">
                    <SidebarMenuButton 
                      asChild 
                      className={`text-sm py-5 px-3 transition-colors hover:bg-muted bg-transparent ${isActive ? 'font-bold' : 'font-medium'} ${isCollapsed ? 'justify-center !px-0 !w-10' : ''}`}
                    >
                      <Link href={item.url}>
                        <item.icon className={`!w-6 !h-6 flex-shrink-0 ${isActive ? 'stroke-[2.5]' : ''}`} />
                        {!isCollapsed && <span className="ml-3">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={`border-t transition-all duration-300 ${isCollapsed ? 'px-0 py-4' : 'p-4'}`}>
        {user && (
          <div className="space-y-4">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <Avatar className="h-10 w-10 border shadow-sm">
                <AvatarImage src={user.avatarUrl || undefined} alt={user.fullName || 'User'} />
                <AvatarFallback>{user.fullName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium truncate">{user.fullName}</p>
                  <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                </div>
              )}
            </div>
            <div className={`flex ${isCollapsed ? 'justify-center' : ''}`}>
              <Button
                variant="outline"
                size="sm"
                className={`transition-all ${isCollapsed ? 'w-10 h-10 p-0 border-none hover:bg-red-50 text-red-600' : 'w-full'}`}
                onClick={handleLogout}
                title={isCollapsed ? "Đăng xuất" : ""}
              >
                <LogOut className={`w-4 h-4 ${isCollapsed ? '' : 'mr-2'}`} />
                {!isCollapsed && <span>Đăng xuất</span>}
              </Button>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
