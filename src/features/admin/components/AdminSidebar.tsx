"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, MessageSquare, Flag, Tag, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { cn } from "@/shared/utils";

interface AdminSidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export function AdminSidebar({ isCollapsed, toggleSidebar }: AdminSidebarProps) {
    const pathname = usePathname();

    const navItems = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "User Management",
            href: "/users",
            icon: Users,
        },
        {
            title: "Post Management",
            href: "/posts",
            icon: FileText,
        },
        {
            title: "Comment Management",
            href: "/comments",
            icon: MessageSquare,
        },
        {
            title: "Report Management",
            href: "/reports",
            icon: Flag,
        },
        {
            title: "Tag Management",
            href: "/tags",
            icon: Tag,
        },
    ];

    return (
        <aside
            className={cn(
                "bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 h-screen sticky top-0 hidden md:flex flex-col transition-all duration-300 ease-in-out",
                isCollapsed ? "w-[80px]" : "w-64"
            )}
        >
            <div className={cn("p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between", isCollapsed && "p-4 justify-center")}>
                <Link href="/" className={cn("flex items-center gap-3 font-bold text-xl overflow-hidden", isCollapsed && "justify-center w-full")}>
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                        <Avatar className="w-full h-full bg-transparent">
                            <AvatarImage
                                src={'/assets/knowhub-logo.png'}
                                alt="KnowHub Logo"
                                className="object-contain p-1.5"
                            />
                            <AvatarFallback className="bg-transparent text-white font-bold">KH</AvatarFallback>
                        </Avatar>
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col leading-none">
                            <span className="text-lg font-bold text-neutral-900 dark:text-white">KnowHub</span>
                            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Admin Panel</span>
                        </div>
                    )}
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-blue-500 text-primary-foreground shadow-sm"
                                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white",
                                isCollapsed && "justify-center px-2"
                            )}
                            title={isCollapsed ? item.title : undefined}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span>{item.title}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
                <button className={cn("flex items-center gap-3 w-full p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors group", isCollapsed && "justify-center px-0")}>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="/avatars/01.png" alt="@admin" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                        <>
                            <div className="flex flex-col items-start flex-1 min-w-0">
                                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate w-full text-left">Admin User</span>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate w-full text-left">admin@knowhub.com</span>
                            </div>
                            <LogOut className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
                        </>
                    )}
                </button>

                <button
                    onClick={toggleSidebar}
                    className="w-full flex items-center justify-center p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                >
                    {isCollapsed ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5" /><path d="m6 17 5-5-5-5" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17-5-5 5-5" /><path d="m18 17-5-5 5-5" /></svg>
                    )}
                </button>
            </div>
        </aside>
    );
}
