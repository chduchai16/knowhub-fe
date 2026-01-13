'use client';

import { useUser } from '@/shared/hooks/use-user';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Grid3x3, Bookmark, UserSquare, Camera, Settings } from 'lucide-react';

export function ProfilePage() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Avatar + User Info */}
      <div className="flex gap-8 md:gap-20 mb-8">
        {/* Avatar */}
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
            <h1 className="text-xl font-normal">{user.username}</h1>
            <Button variant="secondary" size="sm" className="px-4">
              Edit profile
            </Button>
            <Button variant="secondary" size="sm" className="px-4">
              View archive
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mb-5">
            <div>
              <span className="font-semibold">{user.postQuantity || 0}</span>
              <span className="text-sm ml-1">posts</span>
            </div>
            <div className="cursor-pointer hover:text-gray-600">
              <span className="font-semibold">{user.followerQuantity || 0}</span>
              <span className="text-sm ml-1">followers</span>
            </div>
            <div className="cursor-pointer hover:text-gray-600">
              <span className="font-semibold">{user.followingQuantity || 0}</span>
              <span className="text-sm ml-1">following</span>
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

      {/* Story Highlights */}
      <div className="flex gap-4 mb-11 overflow-x-auto pb-2">
        {/* New Story */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
            <span className="text-3xl text-gray-400">+</span>
          </div>
          <span className="text-xs">New</span>
        </div>

        {/* Sample Stories */}
        {[
          { name: 'Travel', color: 'from-purple-400 to-pink-400' },
          { name: 'Food', color: 'from-yellow-400 to-orange-400' },
          { name: 'Work', color: 'from-blue-400 to-cyan-400' },
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
            <span className="hidden md:inline">POSTS</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            <span className="hidden md:inline">SAVED</span>
          </TabsTrigger>
          <TabsTrigger value="tagged" className="flex items-center gap-2">
            <UserSquare className="w-4 h-4" />
            <span className="hidden md:inline">TAGGED</span>
          </TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="mt-8">
          {user.postQuantity === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4">
                <Camera className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Share Photos</h2>
              <p className="text-sm text-gray-600 mb-4">
                When you share photos, they will appear on your profile.
              </p>
              <button className="text-blue-500 font-semibold text-sm hover:text-blue-700">
                Share your first photo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {/* danh sách post */}
              {Array.from({ length: user.postQuantity || 0 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded hover:opacity-75 transition-opacity cursor-pointer"
                />
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
            <h2 className="text-2xl font-bold mb-2">Save</h2>
            <p className="text-sm text-gray-600">
              Save photos and videos that you want to see again.
            </p>
          </div>
        </TabsContent>

        {/* danh sách post được người khác tag vào */}
        <TabsContent value="tagged" className="mt-8">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4">
              <UserSquare className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Photos of you</h2>
            <p className="text-sm text-gray-600">
              When people tag you in photos, they'll appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
