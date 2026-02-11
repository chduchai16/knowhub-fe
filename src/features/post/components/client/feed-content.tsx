'use client'

import Link from "next/link";
import { Post } from "../../models/post";
import { Heart, MessageCircle, Share2, MoreHorizontal, Flag, Trash2, Globe, Lock, Users, Copy, Edit } from "lucide-react";
import { getRelativeTime } from "@/shared/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { PostPopup } from "./post-popup";
import { PostLikeService } from "../../services/post-like-service";
import { PostService } from "../../services/post-service";
import { AvatarImage } from "@/shared/components/avatar-image";
import { useUser } from "@/shared/hooks/use-user";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/shared/components/ui/dropdown-menu";
import { toast } from "sonner";
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
import { ReportDialog } from "@/features/report/components/report-dialog";

interface FeedContentProps {
  post: Post;
  onLikeChange?: (postId: number, isLiked: boolean, likeQuantity: number, postLikeId?: number) => void;
  onDelete?: (postId: number) => void;
  onUpdate?: (post: Post) => void;
}

export function FeedContent({ post, onLikeChange, onDelete, onUpdate }: FeedContentProps) {
  const { user: currentUser } = useUser();
  const isAuthor = currentUser?.username === post.username || currentUser?.id === post.userId;
  
  const hasMedia = post.medias && post.medias.length > 0 && post.medias[0]?.url;
  const mediaType = post.medias?.[0]?.type?.toUpperCase();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [localIsLiked, setLocalIsLiked] = useState(post.isLiked || false);
  const [localLikeQuantity, setLocalLikeQuantity] = useState(post.likeQuantity || 0);

  const handleDelete = async () => {
    if (!post.id) return;
    try {
      setIsDeleting(true);
      await PostService.deletePost(post.id);
      toast.success("Đã xóa bài viết thành công");
      onDelete?.(post.id);
    } catch (error) {
      toast.error("Không thể xóa bài viết. Vui lòng thử lại sau.");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const updatePrivacy = async (privacy: string) => {
    if (!post.id) return;
    try {
      const updatedPost = await PostService.updatePost(post.id, { ...post, privacy });
      toast.success(`Đã đổi quyền riêng tư thành ${privacy}`);
      onUpdate?.(updatedPost);
    } catch (error) {
      toast.error("Không thể cập nhật quyền riêng tư");
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Đã sao chép liên kết");
  };

  const handleReport = () => {
    setIsReportDialogOpen(true);
  };

  const handleLike = async () => {
    try {
      setLoadingLike(true);
      setLocalIsLiked(true);
      setLocalLikeQuantity(prev => prev + 1);
      const postLikeId = await PostLikeService.likePost(post.id!);
      onLikeChange?.(post.id!, true, localLikeQuantity + 1, postLikeId);
    } catch (error) {
      setLocalIsLiked(false);
      setLocalLikeQuantity(prev => prev - 1);
    } finally {
      setLoadingLike(false);
    }
  }

  const handleUnlike = async () => {
    try {
      setLoadingLike(true);
      setLocalIsLiked(false);
      setLocalLikeQuantity(prev => prev - 1);
      await PostLikeService.unlikePost(post.postLikeId!);
      onLikeChange?.(post.id!, false, localLikeQuantity - 1);
    } catch (error) {
      setLocalIsLiked(true);
      setLocalLikeQuantity(prev => prev + 1);
    } finally {
      setLoadingLike(false);
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${post.username}`} className="hover:opacity-80 transition-opacity">
              <AvatarImage src={post.userAvatarUrl} alt={post.username} size="lg" />
            </Link>
            <div>
              <Link href={`/profile/${post.username}`} className="font-semibold hover:underline">
                {post.username || 'User'}
              </Link>
              <p className="text-sm text-gray-500">{getRelativeTime(post.createdAt)}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {isAuthor ? (
                <>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Edit className="w-4 h-4" /> Chỉnh sửa bài viết
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => updatePrivacy('PUBLIC')} className="gap-2 cursor-pointer">
                    <Globe className="w-4 h-4" /> Công khai
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updatePrivacy('FRIENDS')} className="gap-2 cursor-pointer">
                    <Users className="w-4 h-4" /> Bạn bè
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updatePrivacy('PRIVATE')} className="gap-2 cursor-pointer">
                    <Lock className="w-4 h-4" /> Chỉ mình tôi
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" /> Xóa bài viết
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
                    <Copy className="w-4 h-4" /> Sao chép liên kết
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleReport} className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                    <Flag className="w-4 h-4" /> Báo cáo vi phạm
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-gray-700">{post.content}</p>
      </div>

      {hasMedia && (
        <div 
          className="w-full cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          {mediaType === 'IMAGE' ? (
            <img
              src={post.medias![0].url}
              alt=""
              className="w-full h-auto max-h-[400px] object-cover"
            />
          ) : mediaType === 'VIDEO' ? (
            <video
              src={post.medias![0].url}
              className="w-full h-auto max-h-[400px] object-cover"
              controls
              autoPlay={false}
            />
          ) : null}
        </div>
      )}

      <div className="p-6 flex gap-3 text-sm text-gray-500 pt-4 border-t border-gray-300">
        <button 
          onClick={localIsLiked ? handleUnlike : handleLike}
          disabled={loadingLike}
          className="flex items-center gap-2 disabled:opacity-50"
        >
          {localIsLiked ? (
            <Heart className="w-5 h-5 fill-red-500 text-red-500 hover:scale-125 transition-transform" />
          ) : (
            <Heart className="w-5 h-5 hover:scale-125 transition-transform" />
          )}
          <span>{localLikeQuantity}</span>
        </button>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 hover:scale-125 transition-transform" />
          <span>{post.commentQuantity || 0}</span>
        </button>
        <button className="flex items-center gap-2 ">
          <Share2 className="w-5 h-5 hover:scale-125 transition-transform" />
          <span>{post.shareQuantity || 0}</span>
        </button>
      </div>

      {/* Single Dialog for both triggers */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!max-w-[80vw] !w-screen">
          <DialogTitle>Chi tiết bài viết</DialogTitle>
          <DialogDescription className="sr-only">Xem chi tiết bài viết với hình ảnh và bình luận</DialogDescription>
          <PostPopup post={post} />
        </DialogContent>
      </Dialog>

      {/* Alert Dialog for confirmation delete */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa bài viết này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bài viết của bạn sẽ bị xóa vĩnh viễn khỏi hệ thống.
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

      {post.id && (
        <ReportDialog 
          isOpen={isReportDialogOpen}
          onOpenChange={setIsReportDialogOpen}
          targetId={post.id}
          targetType="post"
        />
      )}
    </div>
  );
}
