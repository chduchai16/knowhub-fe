'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Bell,
  User,
  PlusSquare,
  Search,
  Menu,
  MessageSquare,
} from 'lucide-react';
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
import { SearchSheet } from '@/features/user/components/client/search-sheet';
import { NotificationsSheet } from '@/features/notification/components/client/notifications-sheet';
import { NotificationIcon } from '@/features/notification/components/client/notification-icon';

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
  const { setOpen, state } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isCollapsed = state === 'collapsed';

  if (!mounted) {
    return (
      <Sidebar collapsible="icon" className="transition-all duration-300 ease-in-out">
        <SidebarHeader className={`border-b py-6 transition-all duration-300 ${isCollapsed ? 'px-0' : 'px-5'}`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex-shrink-0 flex items-center justify-center">
               <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                <Avatar className="w-full h-full bg-transparent">
                    <AvatarImage
                        src={'/assets/logo-svg.svg'}
                        alt="KnowHub"
                        className="object-contain p-1"
                    />
                    <AvatarFallback className="bg-transparent text-white font-bold text-xs">KH</AvatarFallback>
                </Avatar>
              </div>
            </div>
            {!isCollapsed && (
              <span className="text-2xl whitespace-nowrap overflow-hidden transition-all duration-300" style={{ fontFamily: "var(--font-pacifico)" }}>
                KnowHub
              </span>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className={isCollapsed ? 'px-0' : 'px-2'}>
            <SidebarGroupContent>
              <SidebarMenu className={isCollapsed ? '!gap-2 items-center' : '!gap-3'}>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title} className={`w-full flex justify-center ${isCollapsed ? 'my-1.5' : ''}`}>
                    <SidebarMenuButton className={`text-base font-medium transition-colors hover:bg-muted bg-transparent ${isCollapsed ? 'justify-center !w-14 !px-3 !py-3' : 'py-5 px-3'}`}>
                      {item.title === 'Thông báo' ? (
                        <Bell className="!w-6 !h-6 flex-shrink-0" />
                      ) : (
                        <item.icon className="!w-6 !h-6 flex-shrink-0" />
                      )}
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

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
                      src={'/assets/logo-svg.svg'}
                      alt="KnowHub"
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
            <SidebarMenu className={`${isCollapsed ? '!gap-2 items-center' : '!gap-3'}`} suppressHydrationWarning>
              {navigationItems.map((item) => {
                const isActive = pathname === item.url || pathname?.startsWith(item.url + '/');
                
                if (item.title === 'Tìm kiếm') {
                  return (
                    <SidebarMenuItem key={item.title} className={`w-full flex justify-center ${isCollapsed ? 'my-1.5' : ''}`}>
                      <SearchSheet>
                        <SidebarMenuButton className={`text-base font-medium cursor-pointer transition-colors hover:bg-muted bg-transparent ${isCollapsed ? 'justify-center !w-14 !px-3 !py-3' : 'py-5 px-3'}`}>
                          <item.icon className="!w-6 !h-6 flex-shrink-0" />
                          {!isCollapsed && <span className="ml-3">{item.title}</span>}
                        </SidebarMenuButton>
                      </SearchSheet>
                    </SidebarMenuItem>
                  );
                }

                if (item.title === 'Thông báo') {
                  return (
                    <SidebarMenuItem key={item.title} className={`w-full flex justify-center ${isCollapsed ? 'my-1.5' : ''}`}>
                      <NotificationsSheet showBadge={false}>
                        <SidebarMenuButton className={`text-base font-medium cursor-pointer transition-colors hover:bg-muted bg-transparent ${isCollapsed ? 'justify-center !w-14 !px-3 !py-3' : 'py-5 px-3'}`}>
                          <NotificationIcon isCollapsed={isCollapsed} className="!w-6 !h-6 flex-shrink-0" />
                          {!isCollapsed && <span className="ml-3">{item.title}</span>}
                        </SidebarMenuButton>
                      </NotificationsSheet>
                    </SidebarMenuItem>
                  );
                }
                
                return (
                  <SidebarMenuItem key={item.title} className={`w-full flex justify-center ${isCollapsed ? 'my-1.5' : ''}`}>
                    <SidebarMenuButton 
                      asChild 
                      className={`text-base transition-colors hover:bg-muted bg-transparent ${isActive ? 'font-bold' : 'font-medium'} ${isCollapsed ? 'justify-center !w-14 !px-3 !py-3' : 'py-5 px-3'}`}
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
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
