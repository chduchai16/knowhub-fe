'use client';

import { useUser } from '@/shared/hooks/use-user';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Grid3x3, Bookmark, UserSquare, Camera, Settings } from 'lucide-react';
import { useEffect , useState } from 'react';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';
import { PostItem } from '../components/post/post-item';

export function ProfilePage() {
  const { user } = useUser();
  const [posts , setPosts] = useState<Post[]>([]);
  const [page , setPage] = useState(1);
  const [limit , setLimit] = useState(16);
  const [Loading , setLoading] = useState(false);

  useEffect(() => {
    // Chỉ gọi API khi đã có thông tin user
    if (!user?.username) {
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await PostService.getPagedPostsOfUser(page -1 , limit , user.username);
        setPosts(response.content);
      } catch (error) {
        console.error("ProfilePage: Fetch posts failed", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [page, user?.username])

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
            <Button 
              variant="secondary" 
              size="sm" 
              className="px-4"
              onClick={() => window.location.href = '/profile/edit'}
            >
              Chỉnh sửa hồ sơ
            </Button>
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
                <span className="text-2xl">📸</span>
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
          {Loading ? (
            <div className="flex justify-center py-20">
              <p className="text-muted-foreground">Đang tải bài viết...</p>
            </div>
          ) : posts.length === 0 ? (
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
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {/* danh sách post */}
              {posts.map((post) => (
                <PostItem key={post.id} post={post} />
              ))}
            </div>
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
    </div>
  );
}
