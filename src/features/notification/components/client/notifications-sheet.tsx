'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { AvatarImage } from '@/shared/components/avatar-image';
import Link from 'next/link';

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'reply';
  userId: number;
  username: string;
  userAvatarUrl?: string;
  postId?: number;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationsContextType {
  unreadCount: number;
  notifications: Notification[];
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    return { unreadCount: 0, notifications: [] };
  }
  return context;
}

interface NotificationsSheetProps {
  children: React.ReactNode;
  showBadge?: boolean; 
}

export function NotificationsSheet({ children, showBadge = false }: NotificationsSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setNotifications([
          {
            id: 1,
            type: 'like',
            userId: 1,
            username: 'user1',
            userAvatarUrl: '/assets/default-avatar.jpg',
            postId: 1,
            message: 'đã thích bài viết của bạn',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            isRead: false,
          },
          {
            id: 2,
            type: 'comment',
            userId: 2,
            username: 'user2',
            userAvatarUrl: '/assets/default-avatar.jpg',
            postId: 2,
            message: 'đã bình luận bài viết của bạn',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            isRead: false,
          },
          {
            id: 3,
            type: 'follow',
            userId: 3,
            username: 'user3',
            userAvatarUrl: '/assets/default-avatar.jpg',
            message: 'đã bắt đầu theo dõi bạn',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            isRead: true,
          },
        ]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Refresh notifications when sheet opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        setNotifications([
          {
            id: 1,
            type: 'like',
            userId: 1,
            username: 'user1',
            userAvatarUrl: '/assets/default-avatar.jpg',
            postId: 1,
            message: 'đã thích bài viết của bạn',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            isRead: false,
          },
          {
            id: 2,
            type: 'comment',
            userId: 2,
            username: 'user2',
            userAvatarUrl: '/assets/default-avatar.jpg',
            postId: 2,
            message: 'đã bình luận bài viết của bạn',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            isRead: false,
          },
          {
            id: 3,
            type: 'follow',
            userId: 3,
            username: 'user3',
            userAvatarUrl: '/assets/default-avatar.jpg',
            message: 'đã bắt đầu theo dõi bạn',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            isRead: true,
          },
        ]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [isOpen]);

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === 'follow') {
      window.location.href = `/profile/${notification.username}`;
    } else if (notification.postId) {
      console.log('Open post:', notification.postId);
    }
    setIsOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationsContext.Provider value={{ unreadCount, notifications }}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent side="left" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Thông báo</SheetTitle>
          <SheetDescription>
            Xem tất cả thông báo của bạn
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 h-[calc(100vh-120px)] overflow-y-auto">
          <div className="space-y-2 px-4">
            {isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                Đang tải thông báo...
              </div>
            )}

            {!isLoading && notifications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Không có thông báo nào
              </div>
            )}

            {!isLoading &&
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleNotificationClick(notification);
                    }
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <Link href={`/profile/${notification.username}`} onClick={e => e.stopPropagation()} className="flex-shrink-0 hover:opacity-80">
                    <AvatarImage 
                      src={notification.userAvatarUrl} 
                      alt={notification.username} 
                      size="md" 
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <Link 
                        href={`/profile/${notification.username}`} 
                        onClick={e => e.stopPropagation()}
                        className="font-semibold hover:underline"
                      >
                        {notification.username}
                      </Link>
                      {' '}
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                  
                </div>
              ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
    </NotificationsContext.Provider>
  );
}
