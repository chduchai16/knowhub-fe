"use client"

import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { UserService } from "../services/user-service";
import { useEffect, useState } from "react";
import { User } from "../models/user";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, ShieldAlert } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { PageResponse } from "@/shared/models/page-response";
import { cn } from "@/shared/utils";

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response: PageResponse<User> = await UserService.getPagedUsers(page, limit, search, role, status);
                console.log('response : ', response);
                setUsers(response.content);
                setTotalPages(response.info.totalPages);
                setTotalElements(response.info.totalElements);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [page, limit, search, role, status]);

    const getPageRange = () => {
        const delta = 2;
        const range = [];
        for (
            let i = Math.max(2, page - delta);
            i <= Math.min(totalPages - 1, page + delta);
            i++
        ) {
            range.push(i);
        }

        if (page - delta > 2) {
            range.unshift("...");
        }
        range.unshift(1);
        if (page + delta < totalPages - 1) {
            range.push("...");
        }
        if (totalPages > 1) {
            range.push(totalPages);
        }
        return range;
    };

    // màu cho fallback avatar
    const getAvatarColor = (userId: number) => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-pink-500",
            "bg-indigo-500",
            "bg-teal-500",
            "bg-orange-500",
            "bg-cyan-500",
            "bg-rose-500",
            "bg-emerald-500",
        ];
        return colors[userId % colors.length];
    };

    return (
        <div>
            {/* header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h1>
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm người dùng
                </Button>
            </div>

            {/* filter */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 mt-6 flex flex-wrap items-center gap-4">
                <div className="relative w-full lg:w-[340px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                    <Input
                        type="search"
                        placeholder="Tìm kiếm theo tên tài khoản, email, họ và tên"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg bg-neutral-100 pl-8"
                    />
                </div>

                <div className="relative w-full sm:w-[180px]">
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="w-full rounded-lg bg-neutral-100">
                            <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả vai trò</SelectItem>
                            <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                            <SelectItem value="USER">Người dùng</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button variant={status === "" ? "default" : "outline"} className={status === "" ? "bg-blue-500 text-white hover:bg-blue-600" : ""} size="sm" onClick={() => setStatus("")}>
                    Tất cả
                </Button>
                <Button variant={status === "ACTIVE" ? "default" : "outline"} className={status === "ACTIVE" ? "bg-green-500 text-white hover:bg-green-600" : ""} size="sm" onClick={() => setStatus("ACTIVE")} >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" /> Hoạt động
                </Button>
                <Button variant={status === "INACTIVE" ? "default" : "outline"} className={status === "INACTIVE" ? "bg-red-500 text-white hover:bg-red-600" : ""} size="sm" onClick={() => setStatus("INACTIVE")} >
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2" /> Không hoạt động
                </Button>
                <Button variant={status === "SUSPENDED" ? "default" : "outline"} className={status === "SUSPENDED" ? "bg-yellow-500 text-white hover:bg-yellow-600" : ""} size="sm" onClick={() => setStatus("SUSPENDED")} >
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" /> Khóa tạm thời
                </Button>
                <Button variant={status === "DELETED" ? "default" : "outline"} className={status === "DELETED" ? "bg-gray-500 text-white hover:bg-gray-600" : ""} size="sm" onClick={() => setStatus("DELETED")} >
                    <div className="w-2 h-2 bg-gray-500 rounded-full mr-2" /> Khóa
                </Button>
            </div>

            {/* main content */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm mt-6 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Người dùng</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Vai trò</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">#{user.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatarUrl} alt={user.username} />
                                                <AvatarFallback className={cn(getAvatarColor(user.id), "text-white font-medium")}>
                                                    {user.username.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.fullName}</span>
                                                <span className="text-xs text-muted-foreground">@{user.username}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <ShieldAlert className={cn(
                                                "h-3.5 w-3.5",
                                                user.roleName === "admin" ? "text-red-500" : "text-blue-500"
                                            )} />
                                            <span className="text-xs font-medium">{user.roleName || "___"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "font-medium",
                                            user.status === "ACTIVE" && "bg-green-50 text-green-700 border-green-200",
                                            user.status === "INACTIVE" && "bg-red-50 text-red-700 border-red-200",
                                            user.status === "SUSPENDED" && "bg-yellow-50 text-yellow-700 border-yellow-200",
                                            user.status === "DELETED" && "bg-gray-50 text-gray-700 border-gray-200"
                                        )}>
                                            {user.status === "ACTIVE" && "Hoạt động"}
                                            {user.status === "INACTIVE" && "Bị khóa"}
                                            {user.status === "SUSPENDED" && "Tạm ngưng"}
                                            {user.status === "DELETED" && "Đã xóa"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    <span>Xem chi tiết</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    <span>Chỉnh sửa</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Xóa người dùng</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Không có dữ liệu người dùng.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t bg-neutral-50/50">
                        <p className="text-sm text-muted-foreground">
                            Trang {page} trên {totalPages}
                        </p>
                        <Pagination className="mx-0 w-auto">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page > 1) setPage(page - 1);
                                        }}
                                        className={cn(page === 1 && "pointer-events-none opacity-50")}
                                    />
                                </PaginationItem>
                                {getPageRange().map((p, i) => (
                                    <PaginationItem key={i}>
                                        {p === "..." ? (
                                            <PaginationEllipsis />
                                        ) : (
                                            <PaginationLink
                                                href="#"
                                                isActive={page === p}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setPage(p as number);
                                                }}
                                            >
                                                {p}
                                            </PaginationLink>
                                        )}
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page < totalPages) setPage(page + 1);
                                        }}
                                        className={cn(page === totalPages && "pointer-events-none opacity-50")}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    );
}