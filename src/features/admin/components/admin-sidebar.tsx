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
    LayoutDashboard
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { cn } from "@/shared/utils";
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
            title: "Dashboard",
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
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
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
                                                                isActive={pathname === item.href}
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

                            // If it's a single item
                            return (
                                <SidebarMenuItem key={group.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === group.href}
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
                <div className={cn("flex items-center gap-3 w-full p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-transparent transition-all", state === "collapsed" && "justify-center p-2 bg-transparent")}>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/01.png" alt="@admin" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    {state === "expanded" && (
                        <>
                            <div className="flex flex-col items-start flex-1 min-w-0">
                                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate w-full text-left">Admin User</span>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate w-full text-left">admin@knowhub.com</span>
                            </div>
                            <button
                                className="p-2 rounded-lg hover:bg-white dark:hover:bg-neutral-700 hover:shadow-sm hover:text-red-500 transition-all text-neutral-400"
                                title="Sign out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
