'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/shared/hooks/use-user';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Grid3x3, Bookmark, UserSquare, Camera, Settings, MoreHorizontal, Flag, MessageCircle } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Post } from '@/features/post/models/post';
import { PostService } from '@/features/post/services/post-service';
import { PostItem } from '@/features/post/components/shared/post-item';
import { User } from '../../models/user';
import { UserService } from '../../services/user-service';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/shared/components/ui/dropdown-menu';
import { ReportDialog } from '@/features/report/components/report-dialog';

interface ProfilePageProps {
  username?: string; // Username từ URL params
}

export function ProfilePage({ username }: ProfilePageProps) {
  const router = useRouter();
  const { user: currentUser } = useUser(); // User đang đăng nhập
  const [profileUser, setProfileUser] = useState<User | null>(null); // User đang xem profile
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingUnFollow, setLoadingUnFollow] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const limit = 12;

  const observer = useRef<IntersectionObserver | null>(null);
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

  // lấy thông tin 
  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        if (username) {
          // nếu có username từ URL thì lấy thông tin profile của user đó
          const userData = await UserService.getUserProfile(username);
          setProfileUser(userData);
        } else if (currentUser) {
          // không có username thì dùng current user (trang profile cá nhân)
          setProfileUser(currentUser);
        }
      } catch (error) {
        console.error("ProfilePage: Fetch user profile failed", error);
      }
    };
    
    fetchProfileUser();
  }, [username, currentUser]);

  // lấy danh sách bài viết
  useEffect(() => {
    const targetUsername = profileUser?.username;
    if (!targetUsername) {
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await PostService.getPagedPostsOfUser(page, limit, targetUsername);
        
        setPosts(prev => {
          const newPosts = response.content.filter(
            newPost => !prev.some(existingPost => existingPost.id === newPost.id)
          );
          return [...prev, ...newPosts];
        });
        
        setHasMore(page + 1 < response.info.totalPages);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [page, profileUser?.username]);

  const handleFollow = async () => {
    try {
      setLoadingFollow(true);
      await UserService.followUser(profileUser?.id!);
      // cập nhật lại số lượng follower và trạng thái follow
      setProfileUser(prev => prev ? { 
        ...prev, 
        followerQuantity: (prev.followerQuantity || 0) + 1,
        isFollowing: true
      } : prev);
    } 
    finally { 
      setLoadingFollow(false);
    }
  }

  const handleUnFollow = async () => {
    try {
      setLoadingUnFollow(true);
      await UserService.unfollowUser(profileUser?.id!);
      // cập nhật lại số lượng follower và trạng thái follow
      setProfileUser(prev => prev ? { 
        ...prev, 
        followerQuantity: (prev.followerQuantity || 0) - 1,
        isFollowing: false
      } : prev);
    } finally { 
      setLoadingUnFollow(false);
    }
  }

  // reset posts khi chuyển user
  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
  }, [profileUser?.username]);

  const user = profileUser;
  const isOwnProfile = currentUser?.username === profileUser?.username;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex gap-8 md:gap-20 mb-8">
        {/* avatar*/}
        <div className="flex-shrink-0">
          <Avatar className="w-32 h-32 md:w-40 md:h-40">
            <AvatarImage src={user.avatarUrl || undefined} alt={user.fullName || 'User'} />
            <AvatarFallback className="text-4xl">
              {user.fullName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* user info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-5">
            <h1 className="text-xl font-normal">{ user.fullName ||user.username}</h1>
            {isOwnProfile ? (
              <Button 
                variant="secondary" 
                size="sm" 
                className="px-4"
                onClick={() => window.location.href = '/profile/edit'}
              >
                Chỉnh sửa hồ sơ
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="px-4"
                  onClick={() => router.push(`/messages?to=${profileUser?.id}`)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Nhắn tin
                </Button>
                
                {profileUser?.isFollowing ? (
                  <Button 
                    variant="outline"
                    size="sm"
                    className="px-4"
                    onClick={handleUnFollow}
                    disabled={loadingUnFollow}
                  >
                    {loadingUnFollow ? 'Đang bỏ theo dõi...' : 'Hủy theo dõi'} 
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    className="px-4"
                    onClick={handleFollow}
                    disabled={loadingFollow}
                  >
                    {loadingFollow ? 'Đang theo dõi...' : 'Theo dõi'}
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem 
                      onClick={() => setIsReportDialogOpen(true)}
                      className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                      <Flag className="h-4 w-4" /> Báo cáo người dùng
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          <div className="flex gap-8 mb-5">
            <div>
              <span className="font-semibold">{user.postQuantity || 0}</span>
              <span className="text-sm ml-1">bài viết</span>
            </div>
            <div className="cursor-pointer hover:text-gray-600">
              <span className="font-semibold">{user.followerQuantity || 0}</span>
              <span className="text-sm ml-1">người theo dõi</span>
            </div>
            <div className="cursor-pointer hover:text-gray-600">
              <span className="font-semibold">{user.followingQuantity || 0}</span>
              <span className="text-sm ml-1">đang theo dõi</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-semibold">{user.fullName}</p>
            {user.bio && (
              <p className="text-sm whitespace-pre-wrap">{user.bio}</p>
            )}
            {user.gender && (
              <p className="text-sm text-gray-600">{user.gender}</p>
            )}
          </div>
        </div>
      </div>

      {/* stories */}
      <div className="flex gap-4 mb-11 overflow-x-auto pb-2 mt-10 py-2">
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
            <span className="text-3xl text-gray-400">+</span>
          </div>
          <span className="text-xs">Mới</span>
        </div>

        {[
          { name: 'Du lịch', color: 'from-purple-400 to-pink-400' },
          { name: 'Ẩm thực', color: 'from-yellow-400 to-orange-400' },
          { name: 'Công việc', color: 'from-blue-400 to-cyan-400' },
        ].map((story) => (
          <div key={story.name} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${story.color} flex items-center justify-center cursor-pointer hover:scale-105 transition-transform p-0.5`}>
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="text-2xl">x</span>
              </div>
            </div>
            <span className="text-xs">{story.name}</span>
          </div>
        ))}
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-center border-t">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <Grid3x3 className="w-4 h-4" />
            <span className="hidden md:inline">BÀI VIẾT</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            <span className="hidden md:inline">ĐÃ LƯU</span>
          </TabsTrigger>
          <TabsTrigger value="tagged" className="flex items-center gap-2">
            <UserSquare className="w-4 h-4" />
            <span className="hidden md:inline">ĐƯỢC GẮN THẺ</span>
          </TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="mt-8">
          {posts.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4">
                <Camera className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Chia sẻ ảnh</h2>
              <p className="text-sm text-gray-600 mb-4">
                Khi bạn chia sẻ ảnh, chúng sẽ xuất hiện trên hồ sơ của bạn.
              </p>
              <button className="text-blue-500 font-semibold text-sm hover:text-blue-700">
                Chia sẻ ảnh đầu tiên của bạn
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                {/* danh sách post */}
                {posts.map((post, index) => {
                  // Gán ref cho element cuối cùng
                  if (posts.length === index + 1) {
                    return (
                      <div key={post.id} ref={lastPostRef}>
                        <PostItem post={post} />
                      </div>
                    );
                  }
                  return <PostItem key={post.id} post={post} />;
                })}
              </div>

              {/* Loading indicator */}
              {loading && (
                <div className="flex justify-center py-8">
                  <p className="text-muted-foreground">Đang tải thêm...</p>
                </div>
              )}

              {/* End message */}
              {!hasMore && posts.length > 0 && (
                <div className="flex justify-center py-8">
                  <p className="text-muted-foreground">Bạn đã xem hết bài viết</p>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* danh sách post được bookmark */}
        <TabsContent value="saved" className="mt-8">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4">
              <Bookmark className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Đã lưu</h2>
            <p className="text-sm text-gray-600">
              Lưu ảnh và video mà bạn muốn xem lại.
            </p>
          </div>
        </TabsContent>

        {/* danh sách post được người khác tag vào */}
        <TabsContent value="tagged" className="mt-8">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4">
              <UserSquare className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Ảnh có mặt bạn</h2>
            <p className="text-sm text-gray-600">
              Khi mọi người gắn thẻ bạn trong ảnh, chúng sẽ xuất hiện ở đây.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {user.id && (
        <ReportDialog 
          isOpen={isReportDialogOpen}
          onOpenChange={setIsReportDialogOpen}
          targetId={user.id}
          targetType="user"
        />
      )}
    </div>
  );
}
