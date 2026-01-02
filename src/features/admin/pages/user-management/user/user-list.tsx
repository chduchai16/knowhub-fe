"use client"

import { Button } from "@/shared/components/ui/button";
import { Eye, Plus } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import { MoreHorizontal, Edit, Trash2, ShieldAlert, X } from "lucide-react";
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
import { useDebounce } from "@/shared/hooks/use-debounce";
import { User } from "@/features/admin/models/user";
import { UserService } from "@/features/admin/services/user-service";
import { UserAction } from "@/shared/models/user-action";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

export function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState<string>("");
    const [roleId, setRoleId] = useState<number | undefined>(undefined);
    const [userStatus, setUserStatus] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{id: number, name: string} | null>(null);
    const router = useRouter();

    // Debounce keyword để tránh gọi API liên tục khi người dùng đang gõ
    const debouncedKeyword = useDebounce(keyword, 500);
    
    // Ref để track previous values và tránh duplicate calls
    const prevFiltersRef = useRef<string | null>(null);

    // Kiểm tra xem có filter nào đang được áp dụng không
    const hasActiveFilters = keyword !== "" || roleId !== undefined || (userStatus !== undefined && userStatus !== "");

    // Xóa tất cả bộ lọc
    const clearFilters = () => {
        setKeyword("");
        setRoleId(undefined);
        setUserStatus(undefined);
        setPage(1);
    };

    useEffect(() => {
        // Tạo key từ tất cả filter values để so sánh
        const currentFilters = JSON.stringify({ page, limit, debouncedKeyword, roleId, userStatus });
        
        // Skip nếu filters không thay đổi
        if (prevFiltersRef.current === currentFilters) {
            return;
        }
        prevFiltersRef.current = currentFilters;
        
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response: PageResponse<User> = await UserService.getPagedUsers({ page, limit, keyword: debouncedKeyword, roleId, userStatus });
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
    }, [page, limit, debouncedKeyword, roleId, userStatus]);

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

    // Điều hướng đến trang chi tiết user
    const handleViewUser = (userId: number , userAction: UserAction) => {
        sessionStorage.setItem("userAction", userAction.toString());
        router.push(`/admin/users/${userId}`);
    };

    // Mở dialog xóa người dùng
    const handleOpenDeleteDialog = (userId: number, userName: string) => {
        setUserToDelete({ id: userId, name: userName });
        setDeleteDialogOpen(true);
    };

    // Xóa người dùng
    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        
        try {
            await UserService.deleteUser(userToDelete.id.toString());
            toast.success("Xóa người dùng thành công!");
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            setTotalElements(prev => prev - 1);
        } finally {
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    return (
        <>
        <div>
            {/* header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h1>
                <Button 
                    size="sm" 
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={() => router.push("/admin/users/new")}
                >
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
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full rounded-lg bg-neutral-100 pl-8"
                    />
                </div>

                <div className="relative w-full sm:w-[180px]">
                    <Select value={roleId?.toString()} onValueChange={(value) => setRoleId(Number(value))}>
                        <SelectTrigger className="w-full rounded-lg bg-neutral-100">
                            <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Quản trị viên</SelectItem>
                            <SelectItem value="2">Người dùng</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button variant={userStatus === "" ? "default" : "outline"} className={userStatus === "" ? "bg-blue-500 text-white hover:bg-blue-600" : ""} size="sm" onClick={() => setUserStatus("")}>
                    Tất cả
                </Button>
                <Button variant={userStatus === "ACTIVE" ? "default" : "outline"} className={userStatus === "ACTIVE" ? "bg-green-500 text-white hover:bg-green-600" : ""} size="sm" onClick={() => setUserStatus("ACTIVE")} >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" /> Hoạt động
                </Button>
                <Button variant={userStatus === "INACTIVE" ? "default" : "outline"} className={userStatus === "INACTIVE" ? "bg-red-500 text-white hover:bg-red-600" : ""} size="sm" onClick={() => setUserStatus("INACTIVE")} >
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2" /> Không hoạt động
                </Button>
                <Button variant={userStatus === "SUSPENDED" ? "default" : "outline"} className={userStatus === "SUSPENDED" ? "bg-yellow-500 text-white hover:bg-yellow-600" : ""} size="sm" onClick={() => setUserStatus("SUSPENDED")} >
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" /> Khóa tạm thời
                </Button>
                <Button variant={userStatus === "DELETED" ? "default" : "outline"} className={userStatus === "DELETED" ? "bg-gray-500 text-white hover:bg-gray-600" : ""} size="sm" onClick={() => setUserStatus("DELETED")} >
                    <div className="w-2 h-2 bg-gray-500 rounded-full mr-2" /> Khóa
                </Button>

                {/* Nút xóa bộ lọc */}
                {hasActiveFilters && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Xóa bộ lọc
                    </Button>
                )}
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
                                                <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
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
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewUser(user.id , UserAction.DETAILT)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    <span>Xem chi tiết</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewUser(user.id , UserAction.UPDATE)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    <span>Chỉnh sửa</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="cursor-pointer text-red-600 focus:text-red-600" 
                                                    onClick={() => handleOpenDeleteDialog(user.id, user.fullName || user.username)}
                                                >
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

        {/* Hỏi xác nhận xóa */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa người dùng "{userToDelete?.name}"? 
                        Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleDeleteUser}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Xóa
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}