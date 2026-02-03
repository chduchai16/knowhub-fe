"use client"

import { RoleService } from "@/features/role/services/role-service";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { PageResponse } from "@/shared/models/page-response";
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/shared/components/ui/pagination";
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
import { toast } from "sonner";
import { cn } from "@/shared/utils";
import dayjs from "dayjs";
import { UserAction } from "@/shared/models/user-action";
import { Role } from "../../models/role";

export function RoleList() {
    const router = useRouter();
    const [keyword, setKeyword] = useState<string>("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<{id: number, name: string} | null>(null);
    const debouncedKeyword = useDebounce(keyword, 500);
    
    // Ref để track previous values và tránh duplicate calls
    const prevFiltersRef = useRef<string | null>(null);

    useEffect(() => {
        // Tạo key từ tất cả filter values để so sánh
        const currentFilters = JSON.stringify({ page, limit, debouncedKeyword });
        
        // Skip nếu filters không thay đổi
        if (prevFiltersRef.current === currentFilters) {
            return;
        }
        prevFiltersRef.current = currentFilters;
        
        const fetchRoles = async () => {
            setLoading(true);
            try {
                const response: PageResponse<Role> = await RoleService.getPagedRoles({ page, limit, keyword: debouncedKeyword });
                setRoles(response.content);
                setTotalPages(response.info.totalPages);
                setTotalElements(response.info.totalElements);
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoles();
    }, [page, limit, debouncedKeyword]);

    // Pagination range
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
        return {
            range,
            showLeftEllipsis: range.length > 0 && range[0] > 2,
            showRightEllipsis: range.length > 0 && range[range.length - 1] < totalPages - 1,
        };
    };

    // Điều hướng đến trang chi tiết role
    const handleViewRole = (roleId: number, userAction: UserAction) => {
        sessionStorage.setItem("userAction", userAction.toString());
        router.push(`/admin/roles/${roleId}`);
    };

    // Open delete dialog
    const handleOpenDeleteDialog = (roleId: number, roleName: string) => {
        setRoleToDelete({ id: roleId, name: roleName });
        setDeleteDialogOpen(true);
    };

    // Delete role
    const handleDeleteRole = async () => {
        if (!roleToDelete) return;
        
        try {
            await RoleService.deleteRole(roleToDelete.id.toString());
            toast.success("Xóa vai trò thành công!");
            setRoles(prev => prev.filter(r => r.id !== roleToDelete.id));
            setTotalElements(prev => prev - 1);
        } finally {
            setDeleteDialogOpen(false);
            setRoleToDelete(null);
        }
    };

    // Skeleton loader for table rows
    const TableSkeleton = () => (
        <>
            {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                </TableRow>
            ))}
        </>
    );

    return (
        <>
        <div className="space-y-6">
            {/* header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Quản lý vai trò</h1>
                <Button 
                    size="sm" 
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={() => router.push("/admin/roles/new")}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm vai trò
                </Button>
            </div>

            {/* filter */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 mt-6 flex flex-wrap items-center gap-4">
                <div className="relative w-full lg:w-[340px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                    <Input
                        type="search"
                        placeholder="Tìm kiếm theo tên vai trò"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full rounded-lg bg-neutral-100 pl-8"
                    />
                </div>
            </div>

            {/* table */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Tên vai trò</TableHead>
                            <TableHead>Quyền hạn</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead>Ngày cập nhật</TableHead>
                            <TableHead className="w-[80px] text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableSkeleton />
                        ) : roles.length > 0 ? (
                            roles.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-medium">#{role.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium capitalize">{role.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {role.permissionNames && role.permissionNames.length > 0 ? (
                                                role.permissionNames.slice(0, 3).map((permission, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {permission}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-muted-foreground text-sm">Không có quyền</span>
                                            )}
                                            {role.permissionNames && role.permissionNames.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{role.permissionNames.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {dayjs(role.createdAt).format("DD/MM/YYYY HH:mm")}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {dayjs(role.updatedAt).format("DD/MM/YYYY HH:mm")}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewRole(role.id, UserAction.DETAILT)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    <span>Xem chi tiết</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewRole(role.id, UserAction.UPDATE)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    <span>Chỉnh sửa</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                                    onClick={() => handleOpenDeleteDialog(role.id, role.name)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Xóa vai trò</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Không có dữ liệu vai trò.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, totalElements)} trong số {totalElements} vai trò
                        </div>
                        <Pagination>
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
                                
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(1);
                                        }}
                                        isActive={page === 1}
                                    >
                                        1
                                    </PaginationLink>
                                </PaginationItem>

                                {getPageRange().showLeftEllipsis && (
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )}

                                {getPageRange().range.map((pageNum) => (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setPage(pageNum);
                                            }}
                                            isActive={page === pageNum}
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                {getPageRange().showRightEllipsis && (
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )}

                                {totalPages > 1 && (
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setPage(totalPages);
                                            }}
                                            isActive={page === totalPages}
                                        >
                                            {totalPages}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}

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

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa vai trò</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa vai trò "{roleToDelete?.name}"? 
                        Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleDeleteRole}
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
