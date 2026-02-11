"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Post } from "../../models/post";
import { PostService } from "../../services/post-service";
import { toast } from "sonner";
import { cn } from "@/shared/utils";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Skeleton } from "@/shared/components/ui/skeleton";
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
import { ArrowLeft, Trash2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const postSchema = z.object({
    content: z.string().min(1, "Nội dung không được để trống"),
    status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]),
});

type PostFormValues = z.infer<typeof postSchema>;

interface PostDetailPageProps {
    postId: string;
}

export function PostDetailPage({ postId }: PostDetailPageProps) {
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeletingPost, setIsDeletingPost] = useState(false);
    const router = useRouter();

    const form = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            content: "",
            status: "PUBLISHED",
        },
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true);
                const postData = await PostService.getPostById(postId);
                setPost(postData);
                if (postData) {
                    form.reset({
                        content: postData.content || "",
                        status: (postData.status || "PUBLISHED") as "PUBLISHED" | "DRAFT" | "ARCHIVED",
                    });
                }
            } catch (error) {
                console.error("Error fetching post:", error);
                toast.error("Không thể tải chi tiết bài viết");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [postId, form]);

    const onSubmit = async (values: PostFormValues) => {
        if (!post?.id) return;

        try {
            setIsSubmitting(true);
            await PostService.updatePost(post.id, {
                ...post,
                content: values.content,
                status: values.status,
            });
            toast.success("Cập nhật bài viết thành công");
            setPost(prev => prev ? { ...prev, content: values.content, status: values.status } : prev);
        } catch (error) {
            console.error("Error updating post:", error);
            toast.error("Lỗi khi cập nhật bài viết");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!post?.id) return;

        try {
            setIsDeletingPost(true);
            await PostService.deletePost(post.id);
            toast.success("Xóa bài viết thành công");
            router.push("/admin/posts");
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Lỗi khi xóa bài viết");
        } finally {
            setIsDeletingPost(false);
            setIsDeleteDialogOpen(false);
        }
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

    const formatDate = (date?: string) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Chi tiết Bài viết</h1>
                        <p className="text-sm text-muted-foreground">Quản lý và chỉnh sửa thông tin bài viết</p>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                </div>
            ) : post ? (
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Author Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Thông tin tác giả</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={post.userAvatarUrl || undefined} alt={post.username} />
                                        <AvatarFallback className={cn(getAvatarColor(post.userId), "text-white font-medium")}>
                                            {post.username?.substring(0, 2).toUpperCase() || "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-gray-900">{post.username || "—"}</p>
                                        <p className="text-sm text-muted-foreground">ID: {post.userId || "—"}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Content Edit Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Nội dung bài viết</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="content"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nội dung</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Nhập nội dung bài viết..."
                                                            className="min-h-32 resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Trạng thái</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Chọn trạng thái" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="PUBLISHED">Công khai</SelectItem>
                                                            <SelectItem value="DRAFT">Nháp</SelectItem>
                                                            <SelectItem value="ARCHIVED">Lưu trữ</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>
                                                        Lựa chọn trạng thái công khai của bài viết
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                                            <Save className="mr-2 h-4 w-4" />
                                            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Thông tin</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Trạng thái</p>
                                    <Badge className={cn("mt-1", getStatusBadgeColor(post.status))}>
                                        {getStatusLabel(post.status)}
                                    </Badge>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">Ngày tạo</p>
                                    <p className="text-sm font-medium mt-1">{formatDate(post.createdAt)}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">Ngày cập nhật</p>
                                    <p className="text-sm font-medium mt-1">{formatDate(post.updatedAt)}</p>
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <p className="text-sm text-muted-foreground mb-3">Thống kê</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Lượt thích:</span>
                                            <span className="font-medium">{post.likeQuantity || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Bình luận:</span>
                                            <span className="font-medium">{post.commentQuantity || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Chia sẻ:</span>
                                            <span className="font-medium">{post.shareQuantity || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delete Card */}
                        <Card className="border-red-200 bg-red-50">
                            <CardHeader>
                                <CardTitle className="text-lg text-red-600">Nguy hiểm</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Xóa bài viết này sẽ xóa vĩnh viễn nó khỏi hệ thống.
                                </p>
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Xóa bài viết
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Không tìm thấy bài viết</p>
                    </CardContent>
                </Card>
            )}

            {/* Delete Confirmation Dialog */}
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
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeletingPost}
                        >
                            {isDeletingPost ? "Đang xóa..." : "Xác nhận xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
