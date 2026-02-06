'use client'

import Link from "next/link";
import { Post } from "../../models/post";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { getRelativeTime } from "@/shared/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/shared/components/ui/dialog";
import { PostPopup } from "./post-popup";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { PostLikeService } from "../../services/post-like-service";
import { toast } from "sonner";

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
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
            {post.userAvatarUrl ? (
              <img
                src={post.userAvatarUrl}
                alt="User Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              post.username?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <div className="w-full cursor-pointer">
              <img
                src={post.medias![0].url}
                alt=""
                className="w-full h-auto object-cover"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="!max-w-[80vw] !w-screen">
            <VisuallyHidden>
              <DialogTitle>Chi tiết bài viết</DialogTitle>
            </VisuallyHidden>
            <PostPopup post={post} />
          </DialogContent>
        </Dialog>
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 cursor-pointer">
              <MessageCircle className="w-5 h-5 hover:scale-125 transition-transform" />
              <span>{post.commentQuantity || 0}</span>
            </button>
          </DialogTrigger>
          <DialogContent className="!max-w-[80vw] !w-screen">
            <VisuallyHidden>
              <DialogTitle>Chi tiết bài viết</DialogTitle>
            </VisuallyHidden>
            <PostPopup post={post} />
          </DialogContent>
        </Dialog>
        <button className="flex items-center gap-2 ">
          <Share2 className="w-5 h-5 hover:scale-125 transition-transform" />
          <span>{post.shareQuantity || 0}</span>
        </button>
      </div>
    </div>
  );
}
