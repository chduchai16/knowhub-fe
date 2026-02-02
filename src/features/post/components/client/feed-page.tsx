'use client'

import { PostService } from "../../services/post-service";
import { useEffect, useState } from "react";
import { Post } from "../../models/post";
import { FeedContent } from "./feed-content";

export function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page , setPage] = useState(1);
  const [limit , setLimit] = useState(3);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await PostService.getNewFeeds(page -1 , limit);
        setPosts(response.content);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bảng tin</h1>
      </div>

      {/* các feeds*/}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Đang tải...</div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <FeedContent key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">Chưa có bài viết nào</div>
        )}
      </div>
    </div>
  );
}
