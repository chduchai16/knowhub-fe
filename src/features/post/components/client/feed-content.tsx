'use client'

import { Post } from "../../models/post";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { getRelativeTime } from "@/shared/utils";

interface FeedContentProps {
  post: Post;
}

export function FeedContent({ post }: FeedContentProps) {
  const hasImage = post.medias && post.medias.length > 0 && post.medias[0]?.url;

  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
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
          <p className="font-semibold">{post.username || 'User'}</p>
          <p className="text-sm text-gray-500">{getRelativeTime(post.createdAt)}</p>
        </div>
      </div>

      <p className="text-gray-700">{post.content}</p>

      {hasImage && (
        <div className="rounded-lg overflow-hidden aspect-square max-w-md mx-auto">
          <img
            src={post.medias![0].url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex gap-6 text-sm text-gray-500 pt-2">
        <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
          <Heart className="w-5 h-5" />
          <span>Thích</span>
        </button>
        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span>Bình luận</span>
        </button>
        <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
          <Share2 className="w-5 h-5" />
          <span>Chia sẻ</span>
        </button>
      </div>
    </div>
  );
}
