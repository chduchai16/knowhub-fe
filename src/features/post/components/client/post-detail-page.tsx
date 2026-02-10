'use client';

import { useEffect, useState, useMemo } from 'react';
import { PostService } from '../../services/post-service';
import { Post } from '../../models/post';
import Link from 'next/link';
import { AvatarImage } from '@/shared/components/avatar-image';
import { Heart, MessageCircle, Share2, SendHorizonal, X } from 'lucide-react';
import { getRelativeTime } from '@/shared/utils/time';
import { useRouter } from 'next/navigation';
import { PostLikeService } from '../../services/post-like-service';
import { CommentService } from '@/features/comment/services/comment-service';
import { Comment } from '@/features/comment/models/comment';
import { PostComment } from '@/features/comment/components/client/post-comment';
import { useRef } from 'react';

interface PostDetailPageProps {
  postId: string;
}

export function PostDetailPage({ postId }: PostDetailPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [loadingLike, setLoadingLike] = useState(false);
  const [localIsLiked, setLocalIsLiked] = useState(false);
  const [localLikeQuantity, setLocalLikeQuantity] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Pagination states
  const [rootCommentsPage, setRootCommentsPage] = useState(0);
  const [rootCommentsHasMore, setRootCommentsHasMore] = useState(true);
  const [loadingMoreRoot, setLoadingMoreRoot] = useState(false);
  const [expandedCommentIds, setExpandedCommentIds] = useState<Set<number>>(new Set());
  const [loadingCommentReplies, setLoadingCommentReplies] = useState<Set<number>>(new Set());
  const [repliesPaginationMap, setRepliesPaginationMap] = useState<Map<number, {page: number, hasMore: boolean, loading: boolean}>>(new Map());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const postData = await PostService.getPostById(postId);
        setPost(postData);
        setLocalIsLiked(postData.isLiked || false);
        setLocalLikeQuantity(postData.likeQuantity || 0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  // Fetch comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      if (!post?.id) return;
      try {
        setLoadingComments(true);
        const response = await CommentService.getCommentsByPostId(post.id);
        setComments(response.content || []);
        setRootCommentsHasMore((response.info?.totalPages ?? 1) > 1);
      } finally {
        setLoadingComments(false);
      }
    };
    if (post?.id) {
      fetchComments();
    }
  }, [post?.id]);

  // Load thêm root comments
  const loadMoreRootComments = async () => {
    if (!post?.id || loadingMoreRoot || !rootCommentsHasMore) return;
    
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

  // Fetch replies khi expand comment
  const handleExpandReplies = async (commentId: number) => {
    if (expandedCommentIds.has(commentId)) return;
    
    try {
      setLoadingCommentReplies(prev => new Set([...prev, commentId]));
      const response = await CommentService.getRepliesByCommentId(commentId, 0);
      
      setComments(prev => [...prev, ...(response.content || [])]);
      setExpandedCommentIds(prev => new Set([...prev, commentId]));
      setRepliesPaginationMap(prev => new Map([...prev, [commentId, {page: 0, hasMore: (response.info?.totalPages ?? 1) > 1, loading: false}]]));
    } catch (error) {
      console.error('Error expanding replies:', error);
    } finally {
      setLoadingCommentReplies(prev => new Set([...prev].filter(id => id !== commentId)));
    }
  };

  // Load thêm replies
  const loadMoreReplies = async (commentId: number) => {
    const pagination = repliesPaginationMap.get(commentId);
    if (!pagination || pagination.loading || !pagination.hasMore) return;
    
    try {
      const newPagination = { ...pagination, loading: true };
      setRepliesPaginationMap(prev => new Map([...prev, [commentId, newPagination]]));
      
      const nextPage = pagination.page + 1;
      const response = await CommentService.getRepliesByCommentId(commentId, nextPage);
      
      setComments(prev => [...prev, ...(response.content || [])]);
      
      const updatedPagination = { page: nextPage, hasMore: (response.info?.totalPages ?? 1) > nextPage + 1, loading: false };
      setRepliesPaginationMap(prev => new Map([...prev, [commentId, updatedPagination]]));
    } catch (error) {
      console.error('Error loading more replies:', error);
    }
  };

  const handleLike = async () => {
    if (!post?.id) return;
    try {
      setLoadingLike(true);
      setLocalIsLiked(true);
      setLocalLikeQuantity(prev => prev + 1);
      const postLikeId = await PostLikeService.likePost(post.id);
      setPost(prev => prev ? { ...prev, postLikeId, isLiked: true, likeQuantity: (prev.likeQuantity || 0) + 1 } : prev);
    } catch (error) {
      setLocalIsLiked(false);
      setLocalLikeQuantity(prev => prev - 1);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleUnlike = async () => {
    if (!post?.postLikeId) return;
    try {
      setLoadingLike(true);
      setLocalIsLiked(false);
      setLocalLikeQuantity(prev => prev - 1);
      await PostLikeService.unlikePost(post.postLikeId);
      setPost(prev => prev ? { ...prev, postLikeId: undefined, isLiked: false, likeQuantity: (prev.likeQuantity || 0) - 1 } : prev);
    } catch (error) {
      setLocalIsLiked(true);
      setLocalLikeQuantity(prev => prev + 1);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleCreateComment = async () => {
    if (!post?.id || !newCommentContent.trim()) return;
    try {
      let rootId: number | null = null;
      if (replyingTo) {
        if (replyingTo.parentId) {
          rootId = replyingTo.rootId ?? replyingTo.parentId;
        } else {
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
      setPost(prev => prev ? { ...prev, commentQuantity: (prev.commentQuantity || 0) + 1 } : prev);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  // tạo rootComments & repliesMap
  const { rootComments, repliesMap } = useMemo(() => {
    const roots: Comment[] = [];
    const replies: Map<number, Comment[]> = new Map();

    comments.forEach(comment => {
      if (!comment.parentId) {
        roots.push(comment);
      } else {
        const rootId = comment.rootId ?? comment.parentId;
        if (!replies.has(rootId)) {
          replies.set(rootId, []);
        }
        replies.get(rootId)!.push(comment);
      }
    });

    return { rootComments: roots, repliesMap: replies };
  }, [comments]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-4">
        <div className="text-muted-foreground">Không tìm thấy bài viết</div>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline">
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-start justify-between mb-6">
          <Link href={`/profile/${post.username}`} className="flex items-start gap-3 hover:opacity-80">
            <AvatarImage src={post.userAvatarUrl} alt={post.username} size="lg" />
            <div>
              <p className="font-semibold hover:underline">{post.username}</p>
              <p className="text-xs text-gray-500">@{post.username}</p>
              <p className="text-xs text-gray-500 mt-1">{getRelativeTime(post.createdAt)}</p>
            </div>
          </Link>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>

        {post.medias && post.medias.length > 0 && (
          <div className="mb-6 flex items-center justify-center bg-white rounded-lg overflow-hidden aspect-square">
            <img
              src={post.medias[0].url}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-6 text-sm text-gray-500 border-t pt-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span>{post.likeQuantity || 0} lượt thích</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentQuantity || 0} bình luận</span>
          </div>
        </div>

        <div className="flex items-center justify-around border-t mt-4 pt-4">
          <button 
            onClick={localIsLiked ? handleUnlike : handleLike}
            disabled={loadingLike}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 p-2 rounded hover:bg-red-50 disabled:opacity-50"
          >
            {localIsLiked ? (
              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            ) : (
              <Heart className="w-5 h-5" />
            )}
            <span className="text-sm">Thích</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 p-2 rounded hover:bg-blue-50">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">Bình luận</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 p-2 rounded hover:bg-green-50">
            <Share2 className="w-5 h-5" />
            <span className="text-sm">Chia sẻ</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg border p-6 mt-6">
        <h2 className="font-semibold text-lg mb-4">Bình luận ({post?.commentQuantity || 0})</h2>

        {/* Comment Input */}
        <div className="mb-6 pb-6 border-b">
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
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Comments List */}
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

        {/* Load more comments button */}
        {!loadingComments && rootCommentsHasMore && (
          <button
            onClick={loadMoreRootComments}
            disabled={loadingMoreRoot}
            className="w-full mt-4 py-2 text-center text-blue-500 hover:text-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            {loadingMoreRoot ? 'Đang tải...' : 'Xem thêm bình luận'}
          </button>
        )}
      </div>
    </div>
  );
}
