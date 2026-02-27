'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { InboxList } from './inbox-list';
import { ChatWindow } from './chat-window';
import { Inbox } from '../../models/inbox';
import { Message } from '../../models/message';
import { MessageService } from '../../services/message-service';
import { ChatService } from '@/shared/sse/chat-service-ws';
import { useUser } from '@/shared/hooks/use-user';
import { UserService } from '@/features/user/services/user-service';
import { User } from '@/features/user/models/user';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const MESSAGES_LIMIT = 20;

export function MessagesPage() {
  const { user } = useUser();
  const chatService = ChatService.getInstance();
  const searchParams = useSearchParams();
  const toUserId = searchParams.get('to') ? parseInt(searchParams.get('to')!, 10) : null;
  
  // Inbox states
  const [inboxes, setInboxes] = useState<Inbox[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [inboxPage, setInboxPage] = useState(1);
  const [loadingInboxes, setLoadingInboxes] = useState(false);
  
  // Messages states
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagePage, setMessagePage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const selectedConversation = inboxes.find((conv) => conv.id === selectedConversationId) || null;

  // Fetch inboxes
  useEffect(() => {
    const fetchInboxes = async () => {
      try {
        setLoadingInboxes(true);
        const response = await MessageService.getInboxes(inboxPage, debouncedSearch);
        if (inboxPage === 1) {
          setInboxes(response.content || []);
        } else {
          setInboxes(prev => [...prev, ...(response.content || [])]);
        }
      } catch (error) {
        toast.error('Lỗi khi tải danh sách tin nhắn');
      } finally {
        setLoadingInboxes(false);
      }
    };
    
    fetchInboxes();
  }, [inboxPage, debouncedSearch]);

  // Fetch messages khi chọn conversation
  useEffect(() => {
    if (!selectedConversationId || !selectedConversation) return;
    
    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const response = await MessageService.getConversation(selectedConversation.partnerId, 1, MESSAGES_LIMIT);
        setMessages(response.content || []);
        setMessagePage(1);
        setHasMoreMessages((response.info?.totalPages ?? 1) > 1);
      } catch (error) {
        toast.error('Lỗi khi tải tin nhắn');
      } finally {
        setLoadingMessages(false);
      }
    };
    
    fetchMessages();
  }, [selectedConversationId, selectedConversation]);

  // Subscribe to real-time messages when page loads
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      setMessages(prev => {
        const messageExists = prev.some(m => m.id === message.id);
        if (messageExists) return prev;
        return [message, ...prev];
      });
      
      // Update inbox with new message
      setInboxes(prev => prev.map(inbox => 
        inbox.id === selectedConversationId
          ? { ...inbox, content: message.content, updatedAt: message.createdAt || new Date().toISOString() }
          : inbox
      ));
    };
    
    // Subscribe to personal message queue
    chatService.subscribeToMessages(handleNewMessage);
    
    return () => {
      chatService.unSubcribe('/user/queue/messages');
    };
  }, [selectedConversationId, chatService]);

  // Auto-select conversation when navigating from profile
  useEffect(() => {
    if (toUserId && inboxes.length > 0) {
      // Try to find existing inbox with this user
      const existingInbox = inboxes.find(inbox => inbox.senderId === toUserId);
      if (existingInbox) {
        // Select the conversation
        setSelectedConversationId(existingInbox.id);
        setSelectedUser(null);
      } else {
        // Fetch user info to display their chat
        const fetchUser = async () => {
          try {
            const userData = await UserService.getUserById(toUserId.toString());
            setSelectedUser(userData);
          } catch (error) {
            console.error('Failed to fetch user info:', error);
          }
        };
        fetchUser();
      }
    }
  }, [toUserId, inboxes]);

  // Load more messages
  const loadMoreMessages = useCallback(async () => {
    if (!selectedConversationId || !selectedConversation || !hasMoreMessages || loadingMessages) return;
    
    try {
      const nextPage = messagePage + 1;
      const response = await MessageService.getConversation(selectedConversation.partnerId, nextPage, MESSAGES_LIMIT);
      setMessages(prev => {
        const newMessages = response.content || [];
        // Filter out messages that already exist
        const existingIds = new Set(prev.map(m => m.id));
        const filteredNew = newMessages.filter(m => !existingIds.has(m.id));
        return [...prev, ...filteredNew];
      });
      setMessagePage(nextPage);
      setHasMoreMessages((response.info?.totalPages ?? 1) > nextPage);
    } catch (error) {
      toast.error('Lỗi khi tải thêm tin nhắn');
    }
  }, [selectedConversationId, selectedConversation, messagePage, hasMoreMessages, loadingMessages]);

  // Send message
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !user?.id) return;
    
    // Determine receiver
    const receiverId = selectedConversation?.partnerId || selectedUser?.id;
    if (!receiverId) return;
    
    try {
      setSendingMessage(true);
      
      // Send message via REST API
      const message = await MessageService.sendMessage(receiverId, { content: content.trim() });
      
      // Add to messages list (avoid duplicates)
      setMessages(prev => {
        const messageExists = prev.some(m => m.id === message.id);
        if (messageExists) return prev;
        return [message, ...prev];
      });
      
      // Update inbox list
      setInboxes(prev => {
        if (selectedConversationId && selectedConversation) {
          // Update existing conversation with new message
          const updated = prev.map(inbox =>
            inbox.id === selectedConversationId
              ? {
                  ...inbox,
                  content: message.content,
                  updatedAt: message.createdAt || new Date().toISOString(),
                }
              : inbox
          );
          
          // Move updated conversation to top
          const updatedConversation = updated.find(i => i.id === selectedConversationId);
          if (updatedConversation) {
            const filtered = updated.filter(i => i.id !== selectedConversationId);
            return [updatedConversation, ...filtered];
          }
          return updated;
        }
        return prev;
      });
      
      // If this is a new conversation (no selectedConversationId), fetch inboxes
      if (!selectedConversationId && selectedUser) {
        const inboxResponse = await MessageService.getInboxes(1, '');
        const newInbox = inboxResponse.content?.find(inbox => inbox.senderId === selectedUser.id);
        if (newInbox) {
          setInboxes(inboxResponse.content || []);
          setSelectedConversationId(newInbox.id);
          setSelectedUser(null);
        }
      }
      
    } catch (error) {
      toast.error('Lỗi khi gửi tin nhắn');
    } finally {
      setSendingMessage(false);
    }
  }, [selectedConversationId, selectedConversation, selectedUser, user]);

  if (loadingInboxes && inboxes.length === 0) {
    return (
      <div className="h-[calc(100vh-50px)] border rounded-xl bg-white overflow-hidden flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-50px)] border rounded-xl bg-white overflow-hidden flex">
      <div className="w-96 flex-shrink-0 border-r flex flex-col">
        <div className="p-4 border-b flex-shrink-0">
          <h2 className="text-xl font-bold">Tin nhắn</h2>
        </div>
        <InboxList
          conversations={inboxes}
          selectedConversationId={selectedConversationId}
          onSelectConversation={(conversationId) => {
            setSelectedConversationId(conversationId);
            setSelectedUser(null);
          }}
          onSearchChange={setSearchTerm}
        />
      </div>
      <ChatWindow 
        selectedConversation={selectedConversation}
        selectedUser={selectedUser}
        messages={messages}
        onSendMessage={handleSendMessage}
        onLoadMoreMessages={loadMoreMessages}
        isLoadingMessages={loadingMessages}
        isSendingMessage={sendingMessage}
        hasMoreMessages={hasMoreMessages}
      />
    </div>
  );
}
