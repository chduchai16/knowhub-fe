'use client';

import { Bell } from 'lucide-react';
import { useNotifications } from './notifications-sheet';

interface NotificationIconProps {
  className?: string;
  isCollapsed?: boolean;
}

export function NotificationIcon({ className, isCollapsed }: NotificationIconProps) {
  const { unreadCount } = useNotifications();

  return (
    <div className="relative inline-flex">
      <Bell className={className} />
      {unreadCount > 0 && (
        <span className={`absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full pointer-events-none ${
          isCollapsed ? '-top-1 -right-1' : '-top-2 -right-2'
        }`}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  );
}
