'use client';

import { useRef, useEffect, useState } from 'react';
import { MessageSquare, Send, Loader2, Smile } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Input } from '@/shared/components/ui/input';
import { Inbox } from '../../models/inbox';
import { Message } from '../../models/message';
import { User } from '@/features/user/models/user';
import { getRelativeTime } from '@/shared/utils/time';

interface ChatWindowProps {
  selectedConversation: Inbox | null;
  selectedUser?: User | null;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  onLoadMoreMessages: () => Promise<void>;
  isLoadingMessages: boolean;
  isSendingMessage: boolean;
  hasMoreMessages: boolean;
}

export function ChatWindow({
  selectedConversation,
  selectedUser,
  messages,
  onSendMessage,
  onLoadMoreMessages,
  isLoadingMessages,
  isSendingMessage,
  hasMoreMessages,
}: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const emojis = ['😀', '😂', '😍', '😢', '😭', '😡', '😱', '😎', '🤔', '😴', '😤', '😷', '🤒', '🤡', '😈', '👻', '💪', '👍', '👎', '✌️', '❤️', '💔', '💯'];

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEmojiPicker]);

  const handleEmojiClick = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Auto-scroll to bottom when new messages arrive (but not when loading more old messages)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Check if user is near the bottom (within 100px)
    const isNearBottom = 
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    // If near bottom or first load, scroll to bottom
    if (isNearBottom || container.scrollTop === 0) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Handle scroll to load more
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMoreMessages && !isLoadingMessages) {
        onLoadMoreMessages();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMoreMessages, isLoadingMessages, onLoadMoreMessages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isSendingMessage) return;
    
    const message = messageInput;
    setMessageInput('');
    await onSendMessage(message);
  };

  if (!selectedConversation && !selectedUser) {
    return (
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
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar>
          <AvatarImage 
            src={(selectedConversation?.partnerAvatarUrl || selectedUser?.avatarUrl) ?? undefined} 
            alt={(selectedConversation?.partnerName || selectedUser?.fullName) ?? '?'} 
          />
          <AvatarFallback>
            {(selectedConversation?.partnerName || selectedUser?.fullName)?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold">
            {selectedConversation?.partnerName || selectedUser?.fullName || selectedUser?.username}
          </h2>
          {selectedConversation && (
            <p className="text-sm text-gray-500">Hoạt động {getRelativeTime(selectedConversation.updatedAt)}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {isLoadingMessages && messages.length === 0 && (
          <div className="flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}
        
        {messages.length === 0 && !isLoadingMessages && (
          <div className="text-center text-gray-500 text-sm">
            Chưa có tin nhắn. Hãy lần đầu tiên gửi tin nhắn!
          </div>
        )}
        
        {[...messages].reverse().map((message, index) => {
          const isFromPartner = message.senderId === (selectedConversation?.partnerId || selectedUser?.id);
          // Use a combination for unique key to avoid duplicates
          const uniqueKey = `${message.id}-${message.senderId}-${message.createdAt}-${index}`;
          return (
            <div
              key={uniqueKey}
              className={`flex gap-3 ${isFromPartner ? 'justify-start' : 'justify-end'}`}
            >
              {isFromPartner && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.senderAvatarUrl} />
                  <AvatarFallback>{message.senderName?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  isFromPartner
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-blue-500 text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">{getRelativeTime(message.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2 items-end">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isSendingMessage}
              className="pr-12"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2" ref={emojiPickerRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 h-8 w-8"
              >
                <Smile className="w-4 h-4" />
              </Button>
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 bg-white border rounded-lg shadow-lg p-3 z-50 w-72">
                  <div className="grid grid-cols-8 gap-2">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiClick(emoji)}
                        className="flex items-center justify-center text-2xl hover:bg-gray-100 rounded transition-colors p-2"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || isSendingMessage}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isSendingMessage ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
