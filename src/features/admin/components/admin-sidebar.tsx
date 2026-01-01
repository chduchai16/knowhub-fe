"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Users,
    Shield,
    UserCog,
    FileText,
    Tag,
    Activity,
    ChevronRight,

    LogOut,
    LayoutDashboard,
    ChevronsUpDown,
    LogIn,
    UserPlus,
    Home
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { cn } from "@/shared/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/shared/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";

export function AdminSidebar() {
    const pathname = usePathname();
    const { state } = useSidebar();

    const menuGroups = [
        {
            title: "Tổng quan",
            icon: LayoutDashboard,
            href: "/admin/dashboard",
        },
        {
            title: "Quản lý người dùng",
            icon: Users,
            items: [
                {
                    title: "Quyền",
                    href: "/admin/permissions",
                    icon: Shield,
                },
                {
                    title: "Người dùng",
                    href: "/admin/users",
                    icon: Users,
                },
                {
                    title: "Vai trò",
                    href: "/admin/roles",
                    icon: UserCog,
                },
            ],
        },
        {
            title: "Quản lý bài viết",
            icon: FileText,
            items: [
                {
                    title: "Bài viết",
                    href: "/admin/posts",
                    icon: FileText,
                },
                {
                    title: "Tag",
                    href: "/admin/tags",
                    icon: Tag,
                },
            ],
        },
        {
            title: "Quản lý tố cáo",
            icon: FileText,
            href: "/admin/reports",
        },
        {
            title: "Quản lý hoạt động",
            icon: Activity,
            href: "/admin/activity",
        }
    ];

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className={cn("flex items-center justify-between p-2", state === "collapsed" && "justify-center p-0")}>
                    <Link href="/" className="flex items-center gap-3 font-bold text-xl overflow-hidden">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                            <Avatar className="w-full h-full bg-transparent">
                                <AvatarImage
                                    src={'/assets/knowhub-logo.png'}
                                    alt="KnowHub Logo"
                                    className="object-contain p-1"
                                />
                                <AvatarFallback className="bg-transparent text-white font-bold text-xs">KH</AvatarFallback>
                            </Avatar>
                        </div>
                        {state === "expanded" && (
                            <div className="flex flex-col leading-none">
                                <span className="text-lg font-bold text-neutral-900 dark:text-white">KnowHub</span>
                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Admin Panel</span>
                            </div>
                        )}
                    </Link>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Tổng quan</SidebarGroupLabel>
                    <SidebarMenu>
                        {menuGroups.map((group) => {
                            // If it's a group with sub-items
                            if (group.items) {
                                return (
                                    <Collapsible key={group.title} asChild defaultOpen className="group/collapsible">
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={group.title}>
                                                    <group.icon />
                                                    <span>{group.title}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {group.items.map((item) => (
                                                        <SidebarMenuSubItem key={item.href}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={pathname.startsWith(item.href)}
                                                            >
                                                                <Link href={item.href}>
                                                                    <span>{item.title}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                );
                            }

                            return (
                                <SidebarMenuItem key={group.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname.startsWith(group.href!)}
                                        tooltip={group.title}
                                    >
                                        <Link href={group.href!}>
                                            <group.icon />
                                            <span>{group.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">Admin User</span>
                                        <span className="truncate text-xs">admin@knowhub.com</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">Admin User</span>
                                            <span className="truncate text-xs">admin@knowhub.com</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/login" className="cursor-pointer">
                                            <LogIn className="mr-2 h-4 w-4" />
                                            <span>Đăng nhập</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/" className="cursor-pointer">
                                            <Home className="mr-2 h-4 w-4" />
                                            <span>Trang chủ</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Đăng xuất</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
