import { MessageSquare, Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';

const conversations = [
  { id: 1, name: 'Nguyễn Văn A', lastMessage: 'Chào bạn, bài viết rất hay!', time: '1 giờ', unread: true },
  { id: 2, name: 'Trần Thị B', lastMessage: 'Ok bạn nhé.', time: '2 giờ', unread: false },
  { id: 3, name: 'Lê Văn C', lastMessage: 'Bạn có đó không?', time: '1 ngày', unread: false },
  { id: 4, name: 'Hoàng Văn D', lastMessage: 'Hẹn gặp bạn sau nhé!', time: '2 ngày', unread: true },
  { id: 5, name: 'Phạm Thị E', lastMessage: 'Cảm ơn bạn đã hỗ trợ.', time: '3 ngày', unread: false },
  { id: 6, name: 'Đỗ Văn F', lastMessage: 'Dự án đang tiến triển tốt.', time: '4 ngày', unread: false },
  { id: 7, name: 'Bùi Thị G', lastMessage: 'Bạn đã xem tài liệu chưa?', time: '5 ngày', unread: true },
  { id: 8, name: 'Vũ Văn H', lastMessage: 'Gửi mình link nhé.', time: '1 tuần', unread: false },
  { id: 9, name: 'Ngô Thị I', lastMessage: 'Chúc mừng sinh nhật!', time: '1 tuần', unread: false },
  { id: 10, name: 'Lý Văn K', lastMessage: 'Mai cafe không?', time: '2 tuần', unread: false },
];

export function MessagesPage() {
  return (
    <div className="h-[calc(100vh-50px)] border rounded-xl bg-white overflow-hidden flex">
      {/* Danh sách hội thoại */}
      <div className="w-84 border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold mb-4">Tin nhắn</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Tìm kiếm tin nhắn..." className="pl-9 bg-gray-50 border-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="p-4 flex gap-3 hover:bg-gray-50 cursor-pointer transition-colors relative"
            >
              <Avatar>
                <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <p className="font-semibold truncate">{conv.name}</p>
                  <span className="text-xs text-gray-400">{conv.time}</span>
                </div>
                <p className={`text-sm truncate ${conv.unread ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unread && (
                <div className="absolute right-4 bottom-4 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Nội dung tin nhắn */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center mx-auto">
            <MessageSquare className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Tin nhắn của bạn</h2>
            <p className="text-gray-500">Gửi ảnh và tin nhắn riêng tư cho bạn bè hoặc nhóm.</p>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600">Gửi tin nhắn</Button>
        </div>
      </div>
    </div>
  );
}
