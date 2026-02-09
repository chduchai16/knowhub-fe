'use client'

import Link from "next/link";
import { Post } from "../../models/post";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { getRelativeTime } from "@/shared/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { PostPopup } from "./post-popup";
import { PostLikeService } from "../../services/post-like-service";
import { AvatarImage } from "@/shared/components/avatar-image";

interface FeedContentProps {
  post: Post;
  onLikeChange?: (postId: number, isLiked: boolean, likeQuantity: number, postLikeId?: number) => void;
}

export function FeedContent({ post, onLikeChange }: FeedContentProps) {
  const hasImage = post.medias && post.medias.length > 0 && post.medias[0]?.url;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  
  const [localIsLiked, setLocalIsLiked] = useState(post.isLiked || false);
  const [localLikeQuantity, setLocalLikeQuantity] = useState(post.likeQuantity || 0);

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

        <p className="text-gray-700">{post.content}</p>
      </div>

      {hasImage && (
        <div 
          className="w-full cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={post.medias![0].url}
            alt=""
            className="w-full h-auto object-cover"
          />
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
    </div>
  );
}
