'use client'
import { Post } from "@/features/post/models/post";
import { useEffect, useState, useMemo } from "react";
import { SendHorizonal, X } from "lucide-react";
import { getRelativeTime } from "@/shared/utils";
import { CommentService } from "@/features/comment/services/comment-service";
import { Comment } from "@/features/comment/models/comment";
import { PostComment } from "@/features/comment/components/client/post-comment";
import { AvatarImage } from "@/shared/components/avatar-image";
import Link from "next/link";

export function PostPopup(
   { post }: { post: Post }
) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [newCommentContent, setNewCommentContent] = useState("");
    const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

    // gọi api lấy comment
    useEffect(() => {
        const fetchComments = async () => {
            if (!post.id) return;
            try {
                setLoadingComments(true);
                const response = await CommentService.getCommentsByPostId(post.id);
                setComments(response.content || []);
            } finally {
                setLoadingComments(false);
            }
        };
        fetchComments();
    }, [post.id]);

    // xây dựng lại cây comment để render
    const { rootComments, repliesMap } = useMemo(() => {
        const roots = comments.filter(c => !c.parentId);
        const replies = new Map<number, Comment[]>();

        comments.forEach(c => {
            if (c.parentId && typeof c.parentId === 'number') {
                if (!replies.has(c.parentId)) {
                    replies.set(c.parentId, []);
                }
                replies.get(c.parentId)!.push(c);
            }
        });

        return { rootComments: roots, repliesMap: replies };
    }, [comments]);

    // tạo comment 
    const handleCreateComment = async () => {
        if (!post.id || !newCommentContent.trim()) return;
        try {
            const newComment = await CommentService.createComment({
                postId: post.id,
                content: newCommentContent,
                parentId: replyingTo?.id || null
            });
            setComments(prev => [newComment, ...prev]);
            setNewCommentContent("");
            setReplyingTo(null);
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    }

    const hasImage = post.medias && post.medias.length > 0 && post.medias[0]?.url;

    return (
        <div className="flex h-[80vh] w-full">
            <div className="w-1/2 flex flex-col">
                <div className="flex items-center gap-3 p-4 border-b">
                    <Link href={`/profile/${post.username}`} className="hover:opacity-80 transition-opacity">
                        <AvatarImage src={post.userAvatarUrl} alt={post.username} size="lg" />
                    </Link>
                    <Link href={`/profile/${post.username}`} className="hover:underline">
                        <p className="font-semibold text-sm">{post.username || 'User'}</p>
                    </Link>
                </div>

                {hasImage && (
                    <div className="flex-1 flex items-center justify-center bg-white overflow-hidden aspect-square">
                        <img
                            src={post.medias![0].url}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>
            
            <div className="w-1/2 border-l flex flex-col">
                <div className="p-4 border-b flex items-center min-h-[72px]">
                    <h3 className="font-semibold">Bình luận</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {/* hiển thị content của bài viết */}
                    <div className="mb-6 pb-4 border-b">
                        <PostComment
                            comment={{
                                id: post.id,
                                postId: post.id,
                                userId: post.userId || 0,
                                username: post.username,
                                userAvatarUrl: post.userAvatarUrl,
                                content: post.content,
                                parentId: null,
                                createdAt: post.createdAt,
                                likeQuantity: 0,
                                replyQuantity: 0
                            } as Comment}
                        />
                    </div>

                    {/* hiển thị danh sách comments */}
                    {loadingComments ? (
                        <div className="text-center py-4 text-gray-500 text-sm">Đang tải bình luận...</div>
                    ) : rootComments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">Chưa có bình luận nào</div>
                    ) : (
                        <div className="space-y-4">
                            {rootComments.map((rootComment) => (
                                <div key={`root-${rootComment.id}`}>
                                    {/* root Comment */}
                                    <PostComment 
                                        comment={rootComment} 
                                        onReplyClick={setReplyingTo}
                                    />

                                    {/* replies tương ứng với comment đó*/}
                                    {rootComment.id && repliesMap.has(rootComment.id) && repliesMap.get(rootComment.id)!.length > 0 && (
                                        <div className="ml-8 mt-3 space-y-3 border-l-2 border-gray-200 pl-4">
                                            {repliesMap.get(rootComment.id!)!.map((reply) => (
                                                <div key={`reply-${reply.id}`}>
                                                    <PostComment 
                                                        comment={reply} 
                                                        isReply={true}
                                                        onReplyClick={setReplyingTo}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t p-4">
                    <div className="flex gap-2 items-center">
                        {replyingTo && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full border border-blue-300 flex-shrink-0">
                                <span className="text-xs text-blue-700 font-medium">@{replyingTo.username}</span>
                                <button
                                    onClick={() => setReplyingTo(null)}
                                    className="text-blue-500 hover:text-red-500 transition-colors ml-1"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                        <input
                            type="text"
                            placeholder={replyingTo ? "Viết trả lời..." : "Thêm bình luận vào đây"}
                            className="flex-1 px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newCommentContent}
                            onChange={(e) => setNewCommentContent(e.target.value)}
                        />
                        <SendHorizonal 
                            onClick={handleCreateComment}
                            className="cursor-pointer hover:text-blue-500 transition-colors flex-shrink-0"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}