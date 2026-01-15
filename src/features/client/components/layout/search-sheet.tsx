'use client';

import { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { Input } from '@/shared/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { UserService } from '../../services/user.service';
import { User as UserType } from '../../models/user';

interface SearchSheetProps {
  children: React.ReactNode;
}

export function SearchSheet({ children }: SearchSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Search users with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await UserService.searchUsers(searchQuery);
        setUsers(results);
      } catch (error) {
        console.error('Search error:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleUserClick = (username: string) => {
    // TODO: Navigate to user profile
    window.location.href = `/profile/${username}`;
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Tìm kiếm người dùng</SheetTitle>
          <SheetDescription>
            Nhập tên hoặc username để tìm kiếm người dùng
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="h-[calc(100vh-200px)] overflow-y-auto">
            <div className="space-y-2">
              {isLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  Đang tìm kiếm...
                </div>
              )}

              {!isLoading && searchQuery && users.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Không tìm thấy người dùng nào
                </div>
              )}

              {!isLoading &&
                searchQuery &&
                users.map((user) => (
                  <button
                    key={user.id}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                    onClick={() => handleUserClick(user.username)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl || undefined} alt={user.fullName} />
                      <AvatarFallback>
                        {user.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.fullName}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        @{user.username}
                      </p>
                    </div>
                  </button>
                ))}

              {!searchQuery && (
                <div className="text-center py-8 text-muted-foreground">
                  Nhập từ khóa để bắt đầu tìm kiếm
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
