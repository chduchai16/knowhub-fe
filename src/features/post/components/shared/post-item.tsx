import { Heart, MessageCircle, Image } from "lucide-react";
import { Post } from "../../models/post";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/shared/components/ui/dialog";
import { PostPopup } from "../client/post-popup";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function PostItem({ post }: { post: Post }) {
  const hasImage = post.medias && post.medias.length > 0 && post.medias[0]?.url;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative aspect-square group cursor-pointer overflow-hidden rounded-sm bg-gray-100">
          {hasImage ? (
            <img
              src={post.medias![0].url}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <Image className="w-12 h-12 text-gray-400" />
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex gap-6 text-white font-semibold">
              <div className="flex items-center gap-1.5">
                <Heart className="w-6 h-6 fill-current" />
                <span>{post.likeQuantity || 0}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-6 h-6 fill-current" />
                <span>{post.commentQuantity || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="!max-w-4xl">
        <VisuallyHidden>
          <DialogTitle>Chi tiết bài viết</DialogTitle>
        </VisuallyHidden>
        <PostPopup post={post} />
      </DialogContent>
    </Dialog>
  );
}