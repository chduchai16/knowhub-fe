'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { InboxList } from './inbox-list';
import { ChatWindow } from './chat-window';
import { Inbox } from '../../models/inbox';
import { Message } from '../../models/message';
import { MessageService } from '../../services/message-service';
import { useUser } from '@/shared/hooks/use-user';
import { UserService } from '@/features/user/services/user-service';
import { User } from '@/features/user/models/user';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { ChatService } from '@/features/message/services/chat-service-ws';

const MESSAGES_LIMIT = 20;

export function MessagesPage() {
  const { user } = useUser();
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

  // Refs to always access latest values inside WS callback (avoids stale closure)
  const selectedConversationRef = useRef<Inbox | null>(null);
  const selectedUserRef = useRef<User | null>(null);
  const currentUserIdRef = useRef<number | undefined>(undefined);

  useEffect(() => { selectedConversationRef.current = selectedConversation; }, [selectedConversation]);
  useEffect(() => { selectedUserRef.current = selectedUser; }, [selectedUser]);
  useEffect(() => { currentUserIdRef.current = user?.id; }, [user]);

  // Real-time WebSocket subscription for incoming messages
  useEffect(() => {
    const chatService = ChatService.getInstance();

    chatService.subscribeToMessages((message: Message) => {
      // Ignore echo: server sends back to sender — we already added it optimistically
      if (message.senderId === currentUserIdRef.current) {
        return;
      }

      const currentConv = selectedConversationRef.current;
      const currentUser = selectedUserRef.current;
      const currentPartnerId = currentConv?.partnerId || currentUser?.id;

      // Add to active conversation if the message is from the current chat partner
      if (currentPartnerId && message.senderId === currentPartnerId) {
        setMessages(prev => {
          const exists = prev.some(m => m.id === message.id);
          if (exists) return prev;
          return [message, ...prev];
        });
      }

      // Update inbox: move the sender's conversation to top with latest message
      setInboxes(prev => {
        const idx = prev.findIndex(i => i.partnerId === message.senderId);
        if (idx < 0) {
          // Unknown sender — soft refresh but preserve current selection by merging
          MessageService.getInboxes(1).then(res => {
            setInboxes(curr => {
              const incoming = res.content || [];
              // Keep any conversations not in server response (e.g. newly created)
              const incomingIds = new Set(incoming.map(i => i.id));
              const preserved = curr.filter(i => !incomingIds.has(i.id));
              return [...incoming, ...preserved];
            });
          }).catch(() => {});
          return prev;
        }
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          content: message.content,
          updatedAt: message.createdAt || new Date().toISOString(),
        };
        const [top] = updated.splice(idx, 1);
        return [top, ...updated];
      });
    });

    return () => {
      chatService.unSubcribe('/user/queue/messages');
    };
  }, []);

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
  const handleSendMessage = useCallback(async (
    content: string,
    mediaIds?: number[],
    localPreviews?: { url: string; type: 'image' | 'video' }[],
  ) => {
    const trimmed = content.trim();
    const hasMedia = mediaIds && mediaIds.length > 0;
    if (!trimmed && !hasMedia) return;
    if (!user?.id) return;

    const receiverId = selectedConversation?.partnerId || selectedUser?.id;
    if (!receiverId) return;

    // --- First message to a new user: use REST to create the conversation ---
    if (!selectedConversationId && selectedUser) {
      try {
        setSendingMessage(true);
        const message = await MessageService.sendMessage(receiverId, { content: trimmed });
        setMessages(prev => {
          if (prev.some(m => m.id === message.id)) return prev;
          return [message, ...prev];
        });
        const inboxResponse = await MessageService.getInboxes(1, '');
        const newInbox = inboxResponse.content?.find(i => i.partnerId === selectedUser.id);
        if (newInbox) {
          setInboxes(inboxResponse.content || []);
          setSelectedConversationId(newInbox.id);
          setSelectedUser(null);
        }
      } catch {
        toast.error('Lỗi khi gửi tin nhắn');
      } finally {
        setSendingMessage(false);
      }
      return;
    }

    // --- Existing conversation: send via WebSocket ---
    const chatService = ChatService.getInstance();

    // Optimistic message shown instantly (upload already done in ChatWindow)
    const optimisticMsg: Message = {
      senderId: user.id,
      senderName: user.fullName || user.username,
      senderAvatarUrl: user.avatarUrl ?? undefined,
      receiverId,
      content: trimmed,
      createdAt: new Date().toISOString(),
      ...(localPreviews && localPreviews.length > 0 ? { __localPreviews: localPreviews } as any : {}),
    };
    setMessages(prev => [optimisticMsg, ...prev]);

    const inboxPreview = trimmed || (hasMedia ? `[${mediaIds!.length} file đính kèm]` : '');
    setInboxes(prev => {
      const idx = prev.findIndex(i => i.id === selectedConversationId);
      if (idx < 0) return prev;
      const updated = [...prev];
      updated[idx] = { ...updated[idx], content: inboxPreview, updatedAt: optimisticMsg.createdAt! };
      const [top] = updated.splice(idx, 1);
      return [top, ...updated];
    });

    // Upload already done in ChatWindow — just send via WebSocket
    chatService.sendChatMessage(receiverId, trimmed, mediaIds ?? []);

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
