'use client'
import { Post } from "@/features/post/models/post";
import { useEffect, useState, useMemo, useRef } from "react";
import { SendHorizonal, X } from "lucide-react";
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
    const [expandedCommentIds, setExpandedCommentIds] = useState<Set<number>>(new Set());
    const [loadingCommentReplies, setLoadingCommentReplies] = useState<Set<number>>(new Set());
    
    // Pagination states
    const [rootCommentsPage, setRootCommentsPage] = useState(0);
    const [rootCommentsHasMore, setRootCommentsHasMore] = useState(true);
    const [loadingMoreRoot, setLoadingMoreRoot] = useState(false);
    const [repliesPaginationMap, setRepliesPaginationMap] = useState<Map<number, {page: number, hasMore: boolean, loading: boolean}>>(new Map());
    
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // gọi api lấy comment (page 0)
    useEffect(() => {
        const fetchComments = async () => {
            if (!post.id) return;
            try {
                setLoadingComments(true);
                const response = await CommentService.getCommentsByPostId(post.id);
                setComments(response.content || []);
                setRootCommentsHasMore((response.info?.totalPages ?? 1) > 1);
            } finally {
                setLoadingComments(false);
            }
        };
        fetchComments();
    }, [post.id]);

    // Load thêm root comments (infinite scroll)
    const loadMoreRootComments = async () => {
        if (!post.id || loadingMoreRoot || !rootCommentsHasMore) return;
        
        try {
            setLoadingMoreRoot(true);
            const nextPage = rootCommentsPage + 1;
            const response = await CommentService.getCommentsByPostId(post.id, nextPage);
            
            setComments(prev => [...prev, ...(response.content || [])]);
            setRootCommentsPage(nextPage);
            setRootCommentsHasMore((response.info?.totalPages ?? 1) > nextPage + 1);
        } catch (error) {
            console.error('Error loading more root comments:', error);
        } finally {
            setLoadingMoreRoot(false);
        }
    };

    // Detect infinite scroll
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            // Khi scroll đến 80% dưới
            if (scrollHeight - scrollTop - clientHeight < 200 && !loadingMoreRoot && rootCommentsHasMore) {
                loadMoreRootComments();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [loadingMoreRoot, rootCommentsHasMore]);

    // focus vào input khi bấm reply
    useEffect(() => {
        if (replyingTo && inputRef.current) {
            inputRef.current.focus();
        }
    }, [replyingTo]);

    // fetch replies khi expand comment
    const handleExpandReplies = async (commentId: number) => {
        if (expandedCommentIds.has(commentId)) return;
        
        try {
            setLoadingCommentReplies(prev => new Set([...prev, commentId]));
            const response = await CommentService.getRepliesByCommentId(commentId, 0);
            
            // merge replies vào comments list
            setComments(prev => [...prev, ...(response.content || [])]);
            
            // mark comment as expanded
            setExpandedCommentIds(prev => new Set([...prev, commentId]));
            
            // track pagination cho replies
            setRepliesPaginationMap(prev => new Map([...prev, [commentId, {
                page: 0,
                hasMore: (response.info?.totalPages ?? 1) > 1,
                loading: false
            }]]));
        } catch (error) {
            console.error('Error fetching replies:', error);
        } finally {
            setLoadingCommentReplies(prev => {
                const newSet = new Set([...prev]);
                newSet.delete(commentId);
                return newSet;
            });
        }
    };

    // Load thêm replies cho một comment
    const loadMoreReplies = async (commentId: number) => {
        const pagination = repliesPaginationMap.get(commentId);
        if (!pagination || !pagination.hasMore || pagination.loading) return;

        try {
            const newMap = new Map(repliesPaginationMap);
            const newPagination = {...pagination, loading: true};
            newMap.set(commentId, newPagination);
            setRepliesPaginationMap(newMap);

            const nextPage = pagination.page + 1;
            const response = await CommentService.getRepliesByCommentId(commentId, nextPage);
            
            setComments(prev => [...prev, ...(response.content || [])]);
            
            const updatedMap = new Map(repliesPaginationMap);
            updatedMap.set(commentId, {
                page: nextPage,
                hasMore: (response.info?.totalPages ?? 1) > nextPage + 1,
                loading: false
            });
            setRepliesPaginationMap(updatedMap);
        } catch (error) {
            console.error('Error loading more replies:', error);
        }
    };

    // xây dựng lại cây comment để render
    const { rootComments, repliesMap } = useMemo(() => {
        const roots = comments.filter(c => !c.parentId);
        const replies = new Map<number, Comment[]>();

        comments.forEach(c => {
            // Chỉ lấy direct replies của root comments (dùng rootId)
            if (c.rootId && typeof c.rootId === 'number') {
                if (!replies.has(c.rootId)) {
                    replies.set(c.rootId, []);
                }
                replies.get(c.rootId)!.push(c);
            }
        });

        return { rootComments: roots, repliesMap: replies };
    }, [comments]);

    // tạo comment 
    const handleCreateComment = async () => {
        if (!post.id || !newCommentContent.trim()) return;
        try {
            // tìm root id
            let rootId: number | null = null;
            if (replyingTo) {
                if (replyingTo.parentId) {
                    // sử dụng rootId (nếu có) hoặc parentId
                    rootId = replyingTo.rootId ?? replyingTo.parentId;
                } else {
                    // sử dụng id của root
                    rootId = replyingTo.id ?? null;
                }
            }

            const newComment = await CommentService.createComment({
                postId: post.id,
                content: newCommentContent,
                parentId: replyingTo?.id ?? undefined,
                rootId: rootId
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

                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4">
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
                                replyQuantity: undefined,
                                rootId: null
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
                            {rootComments.map((rootComment, index) => (
                                <div key={`root-${index}-${rootComment.id ?? `temp-${index}`}`}>
                                    {/* root Comment */}
                                    <PostComment 
                                        comment={rootComment} 
                                        onReplyClick={setReplyingTo}
                                    />

                                    {/* Xem thêm replies button */}
                                    {rootComment.id && !expandedCommentIds.has(rootComment.id) && rootComment.replyQuantity !== undefined && rootComment.replyQuantity > 0 && (
                                        <button
                                            onClick={() => handleExpandReplies(rootComment.id!)}
                                            disabled={loadingCommentReplies.has(rootComment.id)}
                                            className="ml-8 mt-2 text-xs text-gray-500 hover:text-blue-500 disabled:opacity-50 transition-colors"
                                        >
                                            {loadingCommentReplies.has(rootComment.id) ? 'Đang tải...' : `Xem thêm ${rootComment.replyQuantity} trả lời`}
                                        </button>
                                    )}

                                    {/* replies tương ứng với comment đó*/}
                                    {rootComment.id && repliesMap.has(rootComment.id) && repliesMap.get(rootComment.id)!.length > 0 && (
                                        <div>
                                            <div className="ml-8 mt-3 space-y-3 border-l-2 border-gray-200 pl-4">
                                                {repliesMap.get(rootComment.id!)!.map((reply, idx) => (
                                                    <div key={`reply-${rootComment.id}-${reply.id ?? `temp-${idx}`}`}>
                                                        <PostComment 
                                                            comment={reply} 
                                                            isReply={true}
                                                            onReplyClick={setReplyingTo}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Xem thêm replies button cho replies */}
                                            {rootComment.id && repliesPaginationMap.get(rootComment.id)?.hasMore && (
                                                <button
                                                    onClick={() => loadMoreReplies(rootComment.id!)}
                                                    disabled={repliesPaginationMap.get(rootComment.id)?.loading ?? false}
                                                    className="ml-16 mt-2 text-xs text-gray-500 hover:text-blue-500 disabled:opacity-50 transition-colors"
                                                >
                                                    {repliesPaginationMap.get(rootComment.id)?.loading ? 'Đang tải...' : 'Xem thêm trả lời'}
                                                </button>
                                            )}
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
                            ref={inputRef}
                            type="text"
                            placeholder={replyingTo ? "Viết trả lời..." : "Thêm bình luận vào đây"}
                            className="flex-1 px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newCommentContent}
                            onChange={(e) => setNewCommentContent(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleCreateComment()}
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