"use client"

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search, X, Plus, MoreHorizontal, Edit, Trash2, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/shared/components/ui/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { Permission } from "../../models/permission";
import { PermissionService } from "../../services/permission-service";
import { toast } from "sonner";

export function PermissionList() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState<string>("");
    const [loading, setLoading] = useState(false);

    // Dialog states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [permissionToEdit, setPermissionToEdit] = useState<Permission | null>(null);
    const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);
    const [formData, setFormData] = useState<{ code: string; description: string }>({
        code: "",
        description: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const debouncedKeyword = useDebounce(keyword, 500);
    const prevFiltersRef = useRef<string | null>(null);

    const hasActiveFilters = keyword !== "";

    const clearFilters = () => {
        setKeyword("");
        setPage(1);
    };

    useEffect(() => {
        const currentFilters = JSON.stringify({ page, limit, debouncedKeyword });

        if (prevFiltersRef.current === currentFilters) {
            return;
        }
        prevFiltersRef.current = currentFilters;

        const fetchPermissions = async () => {
            setLoading(true);
            try {
                const response = await PermissionService.getPagedPermissions(page - 1, limit, debouncedKeyword);
                setPermissions(response.content);
                setTotalPages(response.info?.totalPages ?? 1);
                setTotalElements(response.info?.totalElements ?? 0);
            } catch (error) {
                console.error("PermissionList: Fetch permissions failed", error);
                toast.error("Không thể tải danh sách quyền");
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, [page, limit, debouncedKeyword]);

    const handleCreatePermission = async () => {
        if (!formData.code.trim()) {
            toast.error("Mã quyền không được để trống");
            return;
        }
        setSubmitting(true);
        try {
            await PermissionService.createPermission({
                code: formData.code.trim(),
                description: formData.description.trim(),
            });
            toast.success("Tạo quyền thành công");
            setIsCreateDialogOpen(false);
            setFormData({ code: "", description: "" });
            setPage(1);
            const response = await PermissionService.getPagedPermissions(0, limit, debouncedKeyword);
            setPermissions(response.content);
            setTotalElements(response.info?.totalElements ?? 0);
        } catch (error) {
            toast.error("Lỗi khi tạo quyền");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdatePermission = async () => {
        if (!permissionToEdit || !formData.code.trim()) return;
        setSubmitting(true);
        try {
            await PermissionService.updatePermission({
                id: permissionToEdit.id,
                code: formData.code.trim(),
                description: formData.description.trim(),
            });
            toast.success("Cập nhật quyền thành công");
            setIsEditDialogOpen(false);
            setPermissions(prev =>
                prev.map(p =>
                    p.id === permissionToEdit.id
                        ? { ...p, code: formData.code.trim(), description: formData.description.trim() }
                        : p
                )
            );
        } catch (error) {
            toast.error("Lỗi khi cập nhật quyền");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePermission = async () => {
        if (!permissionToDelete) return;
        setSubmitting(true);
        try {
            await PermissionService.deletePermission(permissionToDelete.id as number);
            toast.success("Xóa quyền thành công");
            setIsDeleteDialogOpen(false);
            setPermissions(prev => prev.filter(p => p.id !== permissionToDelete.id));
            setTotalElements(prev => prev - 1);
        } catch (error) {
            toast.error("Lỗi khi xóa quyền");
        } finally {
            setSubmitting(false);
        }
    };

    const openEditDialog = (permission: Permission) => {
        setPermissionToEdit(permission);
        setFormData({
            code: permission.code,
            description: permission.description || "",
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (permission: Permission) => {
        setPermissionToDelete(permission);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý Quyền</h1>
                    <p className="text-sm text-gray-500">Quản lý danh sách quyền hạn truy cập trong hệ thống.</p>
                </div>
                <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                        setFormData({ code: "", description: "" });
                        setIsCreateDialogOpen(true);
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm Quyền
                </Button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Tìm kiếm quyền..."
                        className="pl-9 h-10"
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10 px-3">
                            <X className="h-4 w-4 mr-2" />
                            Xóa lọc
                        </Button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="w-[100px] py-4 px-6 text-gray-600 font-semibold">ID</TableHead>
                            <TableHead className="py-4 px-6 text-gray-600 font-semibold">Mã Quyền</TableHead>
                            <TableHead className="py-4 px-6 text-gray-600 font-semibold">Mô Tả</TableHead>
                            <TableHead className="text-right py-4 px-6 text-gray-600 font-semibold">Thao Tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell className="px-6">
                                        <Skeleton className="h-4 w-8" />
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <Skeleton className="h-4 w-32" />
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <Skeleton className="h-4 w-48" />
                                    </TableCell>
                                    <TableCell className="px-6 text-right">
                                        <Skeleton className="h-8 w-8 ml-auto" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : permissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-40 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <Shield className="h-8 w-8 text-gray-300" />
                                        <p>Không tìm thấy quyền nào.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            permissions.map((permission) => (
                                <TableRow key={permission.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <TableCell className="px-6 font-mono text-xs text-gray-400">#{permission.id}</TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 rounded-lg bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                                                <Shield className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="font-semibold text-gray-700">{permission.code}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {permission.description || <span className="text-gray-400 italic">—</span>}
                                        </p>
                                    </TableCell>
                                    <TableCell className="px-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => openEditDialog(permission)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => openDeleteDialog(permission)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Xóa
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">

                {totalPages > 1 && (
                    <div className="order-1 sm:order-2">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page > 1) setPage(page - 1);
                                        }}
                                        className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>

                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === i + 1}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setPage(i + 1);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page < totalPages) setPage(page + 1);
                                        }}
                                        className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Thêm Quyền Mới</DialogTitle>
                        <DialogDescription>Tạo một quyền truy cập mới trong hệ thống.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="code">Mã Quyền</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="VD: create_post, edit_comment..."
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Mô Tả</Label>
                            <Textarea
                                id="description"
                                value={formData.description || ""}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Mô tả quyền này..."
                                className="col-span-3 min-h-20"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleCreatePermission} disabled={submitting}>
                            {submitting ? "Đang tạo..." : "Tạo mới"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Sửa Quyền</DialogTitle>
                        <DialogDescription>Thay đổi thông tin của quyền này.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-code">Mã Quyền</Label>
                            <Input
                                id="edit-code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Mô Tả</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description || ""}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="col-span-3 min-h-20"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleUpdatePermission} disabled={submitting}>
                            {submitting ? "Đang cập nhật..." : "Lưu thay đổi"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Quyền{" "}
                            <span className="font-bold text-gray-900">"{permissionToDelete?.code}"</span> sẽ bị xóa
                            vĩnh viễn khỏi hệ thống.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeletePermission}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={submitting}
                        >
                            {submitting ? "Đang xóa..." : "Xác nhận xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

