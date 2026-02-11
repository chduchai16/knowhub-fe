"use client"

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search, Tag as TagIcon, X, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
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
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { Tag } from "../../models/tag";
import { TagService } from "../../services/tag-service";
import { toast } from "sonner";

export function TagList() {
    const [tags, setTags] = useState<Tag[]>([]);
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
    const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
    const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
    const [tagName, setTagName] = useState("");
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
        
        const fetchTags = async () => {
            setLoading(true);
            try {
                const response = await TagService.getPagedTags(page - 1, limit, debouncedKeyword);
                setTags(response.content);
                setTotalPages(response.info?.totalPages ?? 1);
                setTotalElements(response.info?.totalElements ?? 0);
            } catch (error) {
                console.error("TagList: Fetch tags failed", error);
                toast.error("Không thể tải danh sách tag");
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, [page, limit, debouncedKeyword]);

    const handleCreateTag = async () => {
        if (!tagName.trim()) {
            toast.error("Tên tag không được để trống");
            return;
        }
        setSubmitting(true);
        try {
            await TagService.createTag(tagName.trim());
            toast.success("Tạo tag thành công");
            setIsCreateDialogOpen(false);
            setTagName("");
            // Refresh first page
            setPage(1);
            const response = await TagService.getPagedTags(0, limit, debouncedKeyword);
            setTags(response.content);
            setTotalElements(response.info?.totalElements ?? 0);
        } catch (error) {
            toast.error("Lỗi khi tạo tag");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateTag = async () => {
        if (!tagToEdit || !tagName.trim()) return;
        setSubmitting(true);
        try {
            await TagService.updateTag(tagToEdit.id as number, tagName.trim());
            toast.success("Cập nhật tag thành công");
            setIsEditDialogOpen(false);
            setTags(prev => prev.map(t => t.id === tagToEdit.id ? { ...t, name: tagName.trim() } : t));
        } catch (error) {
            toast.error("Lỗi khi cập nhật tag");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteTag = async () => {
        if (!tagToDelete) return;
        setSubmitting(true);
        try {
            await TagService.deleteTag(tagToDelete.id as number);
            toast.success("Xóa tag thành công");
            setIsDeleteDialogOpen(false);
            setTags(prev => prev.filter(t => t.id !== tagToDelete.id));
            setTotalElements(prev => prev - 1);
        } catch (error) {
            toast.error("Lỗi khi xóa tag");
        } finally {
            setSubmitting(false);
        }
    };

    const openEditDialog = (tag: Tag) => {
        setTagToEdit(tag);
        setTagName(tag.name);
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (tag: Tag) => {
        setTagToDelete(tag);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý Tag</h1>
                    <p className="text-sm text-gray-500">Quản lý các nhãn bài viết trên hệ thống.</p>
                </div>
                <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                        setTagName("");
                        setIsCreateDialogOpen(true);
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm Tag
                </Button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Tìm kiếm nhãn..."
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
                            <TableHead className="py-4 px-6 text-gray-600 font-semibold">Tên nhãn</TableHead>
                            <TableHead className="text-right py-4 px-6 text-gray-600 font-semibold">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell className="px-6"><Skeleton className="h-4 w-8" /></TableCell>
                                    <TableCell className="px-6"><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell className="px-6 text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : tags.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-40 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <TagIcon className="h-8 w-8 text-gray-300" />
                                        <p>Không tìm thấy nhãn nào.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            tags.map((tag) => (
                                <TableRow key={tag.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <TableCell className="px-6 font-mono text-xs text-gray-400">#{tag.id}</TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                                                <TagIcon className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="font-semibold text-gray-700">{tag.name}</span>
                                        </div>
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
                                                <DropdownMenuItem onClick={() => openEditDialog(tag)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    onClick={() => openDeleteDialog(tag)}
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
                        <DialogTitle>Thêm Tag mới</DialogTitle>
                        <DialogDescription>
                            Tạo một nhãn mới để gắn vào các bài viết.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Tên nhãn</Label>
                            <Input
                                id="name"
                                value={tagName}
                                onChange={(e) => setTagName(e.target.value)}
                                placeholder="Ví dụ: ReactJS, Java, ..."
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleCreateTag} disabled={submitting}>
                            {submitting ? "Đang tạo..." : "Tạo mới"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Sửa Tag</DialogTitle>
                        <DialogDescription>
                            Thay đổi tên của nhãn này.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Tên nhãn</Label>
                            <Input
                                id="edit-name"
                                value={tagName}
                                onChange={(e) => setTagName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleUpdateTag} disabled={submitting}>
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
                            Hành động này không thể hoàn tác. Tag <span className="font-bold text-gray-900">"{tagToDelete?.name}"</span> sẽ bị xóa vĩnh viễn khỏi hệ thống.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDeleteTag}
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

