import { Heart, MessageCircle, Image } from "lucide-react";
import { Post } from "../../models/post";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/shared/components/ui/dialog";
import { PostPopup } from "../client/post-popup";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function PostItem({ post }: { post: Post }) {
  const hasMedia = post.medias && post.medias.length > 0 && post.medias[0]?.url;
  const mediaType = post.medias?.[0]?.type?.toUpperCase();

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative aspect-square group cursor-pointer overflow-hidden rounded-sm bg-gray-100">
          {hasMedia ? (
            <>
              {mediaType === 'IMAGE' ? (
                <img
                  src={post.medias![0].url}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : mediaType === 'VIDEO' ? (
                <>
                  <video
                    src={post.medias![0].url}
                    className="w-full h-full object-cover max-h-[400px]"
                    autoPlay={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-white transition-colors">
                      <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </>
              ) : null}
            </>
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