"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import React from "react";

const routeMap: Record<string, { label: string; parent?: string }> = {
    "/admin": { label: "Admin" },
    "/admin/dashboard": { label: "Dashboard" },
    "/admin/users": { label: "Người dùng", parent: "Quản lý người dùng" },
    "/admin/permissions": { label: "Quyền", parent: "Quản lý người dùng" },
    "/admin/roles": { label: "Vai trò", parent: "Quản lý người dùng" },
    "/admin/posts": { label: "Bài viết", parent: "Quản lý bài viết" },
    "/admin/tags": { label: "Tag", parent: "Quản lý bài viết" },
    "/admin/activity": { label: "Quản lý hoạt động" },
};

export function AdminBreadcrumb() {
    const pathname = usePathname();
    const currentRoute = routeMap[pathname];

    if (!currentRoute) return null;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                        <Link href="/admin/dashboard">Admin</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />

                {currentRoute.parent && (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink className="cursor-default hover:text-muted-foreground">
                                {currentRoute.parent}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </>
                )}

                <BreadcrumbItem>
                    <BreadcrumbPage>{currentRoute.label}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
