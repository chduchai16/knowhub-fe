import { Comment } from "../../models/comment";
import { getRelativeTime } from "@/shared/utils";
import { AvatarImage } from "@/shared/components/avatar-image";
import Link from "next/link";
import { MoreHorizontal, Trash2, Flag, Copy } from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/shared/components/ui/dropdown-menu";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from "@/shared/components/ui/alert-dialog";
import { useState } from "react";
import { useUser } from "@/shared/hooks/use-user";
import { CommentService } from "../../services/comment-service";
import { toast } from "sonner";
import { ReportDialog } from "@/features/report/components/report-dialog";

export function PostComment(
    { 
        comment, 
        isReply = false,
        onReplyClick,
        onDelete
    }: { 
        comment: Comment; 
        isReply?: boolean;
        onReplyClick?: (comment: Comment) => void;
        onDelete?: (commentId: number) => void;
    }
) {
    const { user: currentUser } = useUser();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isAuthor = currentUser?.username === comment.username || currentUser?.id === comment.userId;
    const textSize = "text-sm";
    const avatarSize = isReply ? "sm" : "md";

    const handleDelete = async () => {
        if (!comment.id) return;
        try {
            setIsDeleting(true);
            await CommentService.deleteComment(comment.id);
            toast.success("Đã xóa bình luận");
            onDelete?.(comment.id);
        } catch (error) {
            toast.error("Không thể xóa bình luận. Vui lòng thử lại sau.");
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    };

    const handleCopyComment = () => {
        if (comment.content) {
            navigator.clipboard.writeText(comment.content);
            toast.success("Đã sao chép nội dung bình luận");
        }
    };

    const handleReport = () => {
        setIsReportDialogOpen(true);
    };
    
    return (
        <div className="group flex gap-3 items-start relative">
            <Link href={`/profile/${comment.username}`} className="flex-shrink-0 hover:opacity-80 transition-opacity">
                <AvatarImage src={comment.userAvatarUrl} alt={comment.username} size={avatarSize} />
            </Link>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <p className={`${textSize} break-words`}>
                            <Link href={`/profile/${comment.username}`} className="font-semibold mr-2 hover:underline inline-block">
                                {comment.username || 'unknown'}
                            </Link>
                            {comment.content}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                            <p className="text-xs text-gray-500">{getRelativeTime(comment.createdAt)}</p>
                            {onReplyClick && (
                                <button
                                    onClick={() => onReplyClick(comment)}
                                    className="flex items-center gap-1 text-xs text-gray-500 font-semibold hover:text-blue-500 transition-colors"
                                >
                                    <span>Trả lời</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-1 hover:bg-gray-100 rounded-full">
                                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={handleCopyComment} className="gap-2 cursor-pointer">
                                    <Copy className="w-4 h-4" /> Sao chép
                                </DropdownMenuItem>
                                {isAuthor ? (
                                    <DropdownMenuItem 
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                        className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" /> Xóa
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem onClick={handleReport} className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                        <Flag className="w-4 h-4" /> Báo cáo
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa bình luận?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {comment.id && (
                <ReportDialog 
                    isOpen={isReportDialogOpen}
                    onOpenChange={setIsReportDialogOpen}
                    targetId={comment.id}
                    targetType="comment"
                />
            )}
        </div>
    )
}