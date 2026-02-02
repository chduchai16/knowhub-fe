'use client'
import { Post } from "@/features/post/models/post";
import { UserService } from "@/features/user/services/user-service";
import { User } from "@/features/user/models/user";
import { useEffect, useState } from "react";
import { SendHorizonal } from "lucide-react";
import { getRelativeTime } from "@/shared/utils";

export function PostPopup(
   { post }: { post: Post }
) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (post.userId) {
            UserService.getUserById(post.userId.toString())
                .then(setUser)
        }
    }, [post.userId]);

    const hasImage = post.medias && post.medias.length > 0 && post.medias[0]?.url;

    return (
        <div className="flex h-[80vh] w-full">
            <div className="w-1/2 flex flex-col">
                <div className="flex items-center gap-3 p-4 border-b">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span>{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-sm">{user?.username || 'Loading...'}</p>
                    </div>
                </div>

                {hasImage && (
                    <div className="flex-1 flex items-center justify-center bg-white overflow-hidden">
                        <img
                            src={post.medias![0].url}
                            alt=""
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                )}
            </div>
            
            <div className="w-1/2 border-l flex flex-col">
                <div className="p-4 border-b">
                    <h3 className="font-semibold">Bình luận</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex gap-3 mb-4 items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 overflow-hidden">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span>{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm">
                                <span className="font-semibold mr-2">{user?.username || 'User'}</span>
                                {post.content}
                            </p>
                            <p className="text-xs text-gray-500">{getRelativeTime(post.createdAt)}</p>
                        </div>
                    </div>

                    <div className="text-sm text-gray-500 text-center py-8">
                        Không có bình luận
                    </div>
                </div>

                <div className="border-t p-4">
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            placeholder="Thêm bình luận vào đây"
                            className="flex-1 px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <SendHorizonal />
                    </div>
                </div>
            </div>
        </div>
    )
}