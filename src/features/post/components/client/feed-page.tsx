'use client'

import { PostService } from "../../services/post-service";
import { useEffect, useState, useRef, useCallback } from "react";
import { Post } from "../../models/post";
import { FeedContent } from "./feed-content";

export function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 50;
  
  // Ref cho observer
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Ref cho element cuối cùng
  const lastPostRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await PostService.getNewFeeds(page, limit);
        
        // thêm post và filter duplicate
        setPosts(prev => {
          const newPosts = response.content.filter(
            newPost => !prev.some(existingPost => existingPost.id === newPost.id)
          );
          return [...prev, ...newPosts];
        });
        
        setHasMore(page + 1 < response.info.totalPages);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [page]);

  // callback cập nhật like 
  const handleLikeChange = (postId: number, isLiked: boolean, likeQuantity: number, postLikeId?: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked, likeQuantity, postLikeId }
        : post
    ));
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bảng tin</h1>
      </div>

      {/* các feeds*/}
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post, index) => {
            if (posts.length === index + 1) {
              return <div key={post.id} ref={lastPostRef}><FeedContent post={post} onLikeChange={handleLikeChange} /></div>;
            }
            return <FeedContent key={post.id} post={post} onLikeChange={handleLikeChange} />;
          })
        ) : (
          !loading && <div className="text-center py-8 text-gray-500">Chưa có bài viết nào</div>
        )}
        
        {loading && (
          <div className="text-center py-8 text-gray-500">Đang tải...</div>
        )}
        
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-8 text-gray-500">Bạn đã xem hết bài viết</div>
        )}
      </div>
    </div>
  );
}
