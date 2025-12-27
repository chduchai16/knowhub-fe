import Link from "next/link";
import { LayoutDashboard, Users, FileText, MessageSquare, Flag, Tag, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

export function AdminSidebar() {
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
        <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 h-screen sticky top-0 hidden md:flex flex-col">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <span className="text-primary">KnowHub</span> Admin
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                        <item.icon className="w-5 h-5" />
                        {item.title}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                <button className="flex items-center gap-3 w-full p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors group">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="/avatars/01.png" alt="@admin" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate w-full text-left">Admin User</span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate w-full text-left">admin@knowhub.com</span>
                    </div>
                    <LogOut className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
                </button>
            </div>
        </aside>
    );
}
