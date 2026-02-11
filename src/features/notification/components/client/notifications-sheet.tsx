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
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../services/notification-service';
import { Notification } from '../../models/notification';
import { getRelativeTime } from '@/shared/utils/time';
import { connectNotificationSse } from '@/shared/sse/notification-sse';
import { toast } from 'sonner';

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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 20;

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.isRead) {
        await NotificationService.markAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      // Lấy username từ các field có thể có (đề phòng SSE khác API)
      const username = notification.actorUsername || (notification as any).actor_username;

      if (notification.type === 'FOLLOW') {
          router.push(`/profile/${username}`);
      } else if (notification.type === 'REPLY' && notification.postId) {
        router.push(`/post/${notification.postId}`);
      } else if (notification.referenceId) {
        router.push(`/post/${notification.referenceId}`);
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
    } finally {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const countResponse = await NotificationService.getUnreadCount();
      const count = countResponse || 0;
      setUnreadCount(typeof count === 'number' ? count : 0);
    };

    fetchUnreadCount();

    // Kết nối SSE để nhận thông báo real-time
    const eventSource = connectNotificationSse((newNotification: Notification) => {
      // Cập nhật state
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      // Hiển thị toast khi có thông báo mới
      toast.success(newNotification.title || "Thông báo mới", {
        description: newNotification.content,
        action: {
          label: "Xem",
          onClick: () => handleNotificationClick(newNotification)
        },
      });
    });

    return () => {
      eventSource.close();
    };
  }, [router]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        
        const apiResponse = await NotificationService.getNotifications(page, limit);
        
        const notificationsData = (apiResponse?.content || []) as Notification[];
        setNotifications(notificationsData);
        
        const countResponse = await NotificationService.getUnreadCount();
        
        const count = countResponse || 0;
        setUnreadCount(typeof count === 'number' ? count : 0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [isOpen, page]);

  const unreadCountFromNotifications = notifications.filter(n => !n.isRead).length || unreadCount;

  return (
    <NotificationsContext.Provider value={{ unreadCount: unreadCountFromNotifications, notifications }}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent side="left" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Thông báo</SheetTitle>
              <SheetDescription>
                Xem tất cả thông báo của bạn
              </SheetDescription>
            </div>
            {unreadCountFromNotifications > 0 && (
              <button
                onClick={async () => {
                  try {
                    await NotificationService.markAllAsRead();
                    setNotifications(prev =>
                      prev.map(n => ({ ...n, isRead: true }))
                    );
                    setUnreadCount(0);
                  } catch (error) {
                    console.error('Error marking all as read:', error);
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
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
              notifications.map((notification) => {
                const username = notification.actorUsername || (notification as any).actor_username;
                return (
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
                    <Link href={`/profile/${username}`} onClick={e => e.stopPropagation()} className="flex-shrink-0 hover:opacity-80">
                      <AvatarImage 
                        src={notification.actorAvatarUrl} 
                        alt={username} 
                        size="md" 
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <Link 
                          href={`/profile/${username}`} 
                          onClick={e => e.stopPropagation()}
                          className="font-semibold hover:underline"
                        >
                          {username}
                        </Link>
                        {' '}
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {getRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
    </NotificationsContext.Provider>
  );
}
