"use client"

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search, X, MoreHorizontal, Eye, Trash2, FileText } from "lucide-react";
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
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { Post } from "../../models/post";
import { PostService } from "../../services/post-service";
import { toast } from "sonner";
import { cn } from "@/shared/utils";

export function PostList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

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

        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await PostService.getPagedPosts(page - 1, limit, debouncedKeyword);
                setPosts(response.content);
                setTotalPages(response.info?.totalPages ?? 1);
                setTotalElements(response.info?.totalElements ?? 0);
            } catch (error) {
                console.error("PostList: Fetch posts failed", error);
                toast.error("Không thể tải danh sách bài viết");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page, limit, debouncedKeyword]);

    const handleDeletePost = async () => {
        if (!postToDelete) return;
        setSubmitting(true);
        try {
            await PostService.deletePost(postToDelete.id as number);
            toast.success("Xóa bài viết thành công");
            setIsDeleteDialogOpen(false);
            setPosts(prev => prev.filter(p => p.id !== postToDelete.id));
            setTotalElements(prev => prev - 1);
        } catch (error) {
            toast.error("Lỗi khi xóa bài viết");
        } finally {
            setSubmitting(false);
        }
    };

    const openDeleteDialog = (post: Post) => {
        setPostToDelete(post);
        setIsDeleteDialogOpen(true);
    };

    const getStatusBadgeColor = (status?: string) => {
        switch (status) {
            case "PUBLISHED":
                return "bg-green-100 text-green-800";
            case "DRAFT":
                return "bg-yellow-100 text-yellow-800";
            case "ARCHIVED":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    const getStatusLabel = (status?: string) => {
        switch (status) {
            case "PUBLISHED":
                return "Công khai";
            case "DRAFT":
                return "Nháp";
            case "ARCHIVED":
                return "Lưu trữ";
            default:
                return status || "—";
        }
    };

    const getAvatarColor = (userId?: number) => {
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
        return colors[(userId ?? 0) % colors.length];
    };

    const truncateContent = (content?: string, maxLength: number = 80) => {
        if (!content) return "—";
        return content.length > maxLength ? content.substring(0, maxLength) + "..." : content;
    };

    const formatDate = (date?: string) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("vi-VN");
    };

    return (
        <>
        <div>
            {/* header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Quản lý Bài viết</h1>
            </div>

            {/* filter */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 mt-6 flex flex-wrap items-center gap-4">
                <div className="relative w-full lg:w-[340px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                    <Input
                        type="search"
                        placeholder="Tìm kiếm bài viết..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full rounded-lg bg-neutral-100 pl-8"
                    />
                </div>

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
                            <TableHead>Tác giả</TableHead>
                            <TableHead>Nội dung</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày tạo</TableHead>
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
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : posts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <FileText className="h-8 w-8 text-gray-300" />
                                        <p>Không tìm thấy bài viết nào.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">#{post.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={post.userAvatarUrl || undefined} alt={post.username} />
                                                <AvatarFallback className={cn(getAvatarColor(post.userId), "text-white font-medium")}>
                                                    {post.username?.substring(0, 2).toUpperCase() || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{post.username || "—"}</span>
                                                <span className="text-xs text-muted-foreground">#{post.userId}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm truncate max-w-xs">
                                            {truncateContent(post.content)}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusBadgeColor(post.status)}>
                                            {getStatusLabel(post.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(post.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => router.push(`/admin/posts/${post.id}`)}>
                                                    <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => openDeleteDialog(post)}
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

            {totalPages > 1 && (
                <div className="flex items-center justify-end px-6 py-4 border-t bg-neutral-50/50">
                    <Pagination className="mx-0 w-auto">
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

        {/* Hỏi xác nhận xóa */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeletePost}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={submitting}
                    >
                        {submitting ? "Đang xóa..." : "Xác nhận xóa"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}

