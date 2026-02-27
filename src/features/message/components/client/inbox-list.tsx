import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Inbox } from '../../models/inbox';
import { getRelativeTime } from '@/shared/utils/time';

interface InboxListProps {
  conversations: Inbox[];
  selectedConversationId: number | null;
  onSelectConversation: (id: number) => void;
  onSearchChange?: (search: string) => void;
}

export function InboxList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onSearchChange,
}: InboxListProps) {
  return (
    <>
      <div className="p-4 border-b flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm tin nhắn..."
            className="pl-9 bg-gray-50 border-none"
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className={`p-4 flex gap-3 cursor-pointer transition-colors relative border-b ${
              selectedConversationId === conv.id ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
          >
            <Avatar>
              <AvatarImage src={conv.partnerAvatarUrl} alt={conv.partnerName} />
              <AvatarFallback>{conv.partnerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <p className="font-semibold truncate">{conv.partnerName}</p>
                <span className="text-xs text-gray-400">{getRelativeTime(conv.updatedAt)}</span>
              </div>
              <p className="text-sm truncate text-gray-500">
                {conv.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
