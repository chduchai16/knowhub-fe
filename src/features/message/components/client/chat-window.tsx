'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { MessageSquare, Send, Loader2, Smile, Paperclip, X, Film } from 'lucide-react';
import { MediaService } from '@/shared/services/media.service';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Input } from '@/shared/components/ui/input';
import { Inbox } from '../../models/inbox';
import { Message } from '../../models/message';
import { User } from '@/features/user/models/user';
import { getRelativeTime } from '@/shared/utils/time';

interface AttachedFile {
  file: File;
  previewUrl: string;
  type: 'image' | 'video';
  mediaId?: number; // assigned after upload completes
}

interface LocalPreview {
  url: string;
  type: 'image' | 'video';
}

// ─── MediaGrid ────────────────────────────────────────────────────────────────
interface MediaItem { url: string; type: 'image' | 'video'; }
interface MediaGridProps { items: MediaItem[]; onImageClick: (url: string) => void; faded?: boolean; }

function MediaCell({ item, onClick, faded, className = '' }: { item: MediaItem; onClick?: () => void; faded?: boolean; className?: string }) {
  return (
    <div className={`relative rounded-lg overflow-hidden bg-gray-100 ${faded ? 'opacity-60' : ''} ${className}`}>
      {item.type === 'video' ? (
        <video src={item.url} controls className="w-full h-full object-cover" />
      ) : (
        <img
          src={item.url}
          alt="attachment"
          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onClick={onClick}
        />
      )}
    </div>
  );
}

function MediaGrid({ items, onImageClick, faded }: MediaGridProps) {
  const MAX_VISIBLE = 4;
  const visible = items.slice(0, MAX_VISIBLE);
  const extra = items.length - MAX_VISIBLE;
  const size = items.length;

  // ── 1 item ──
  if (size === 1) {
    return (
      <MediaCell item={visible[0]} onClick={() => onImageClick(visible[0].url)} faded={faded}
        className="w-48 h-48" />
    );
  }

  // ── 2 items ── side-by-side
  if (size === 2) {
    return (
      <div className="grid grid-cols-2 gap-0.5 w-56 rounded-lg overflow-hidden">
        {visible.map((item, i) => (
          <MediaCell key={i} item={item} onClick={() => onImageClick(item.url)} faded={faded} className="h-28" />
        ))}
      </div>
    );
  }

  // ── 3 items ── 1 large left + 2 stacked right
  if (size === 3) {
    return (
      <div className="flex gap-0.5 w-56 rounded-lg overflow-hidden">
        <MediaCell item={visible[0]} onClick={() => onImageClick(visible[0].url)} faded={faded} className="flex-1 h-56" />
        <div className="flex flex-col gap-0.5 w-[44%]">
          <MediaCell item={visible[1]} onClick={() => onImageClick(visible[1].url)} faded={faded} className="h-[110px]" />
          <MediaCell item={visible[2]} onClick={() => onImageClick(visible[2].url)} faded={faded} className="h-[110px]" />
        </div>
      </div>
    );
  }

  // ── 4+ items ── 2×2 grid, last cell shows "+N" overlay if more
  return (
    <div className="grid grid-cols-2 gap-0.5 w-56 rounded-lg overflow-hidden">
      {visible.map((item, i) => {
        const isLast = i === MAX_VISIBLE - 1 && extra > 0;
        return (
          <div key={i} className="relative h-28 rounded-sm overflow-hidden bg-gray-100">
            <MediaCell item={item} onClick={() => onImageClick(item.url)} faded={faded} className="w-full h-full" />
            {isLast && (
              <div
                className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"
                onClick={() => onImageClick(item.url)}
              >
                <span className="text-white text-xl font-bold">+{extra + 1}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
// ──────────────────────────────────────────────────────────────────────────────

interface ChatWindowProps {
  selectedConversation: Inbox | null;
  selectedUser?: User | null;
  messages: Message[];
  onSendMessage: (content: string, mediaIds?: number[], localPreviews?: LocalPreview[]) => Promise<void>;
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
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Track whether user is near bottom so ResizeObserver knows when to auto-scroll
  const shouldAutoScrollRef = useRef(true);

  const emojis = ['😀', '😂', '😍', '😢', '😭', '😡', '😱', '😎', '🤔', '😴', '😤', '😷', '🤒', '🤡', '😈', '👻', '💪', '👍', '👎', '✌️', '❤️', '💔', '💯'];

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      attachedFiles.forEach(f => URL.revokeObjectURL(f.previewUrl));
    };
  }, []);

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

  // Auto-scroll when messages list changes (new message sent/received)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    // Only auto-scroll if user is near bottom or list just initialised
    if (distFromBottom < 150 || messages.length <= 20) {
      shouldAutoScrollRef.current = true;
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // ResizeObserver: re-scroll to bottom when images/videos expand the container height
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      if (shouldAutoScrollRef.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Track auto-scroll intent + handle load-more on scroll to top
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      shouldAutoScrollRef.current = distFromBottom < 150;
      if (container.scrollTop === 0 && hasMoreMessages && !isLoadingMessages) {
        onLoadMoreMessages();
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMoreMessages, isLoadingMessages, onLoadMoreMessages]);

  // Handle file selection — upload immediately
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newAttached: AttachedFile[] = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      mediaId: undefined, // uploading...
    }));

    setAttachedFiles(prev => [...prev, ...newAttached]);
    e.target.value = '';

    setIsUploadingFiles(true);
    try {
      const mediaIds = await MediaService.updateTempImages(files);
      // Assign returned mediaIds to corresponding AttachedFile entries
      setAttachedFiles(prev => {
        const result = [...prev];
        let idIdx = 0;
        for (let i = 0; i < result.length; i++) {
          if (newAttached.some(na => na.file === result[i].file)) {
            result[i] = { ...result[i], mediaId: mediaIds[idIdx++] };
          }
        }
        return result;
      });
    } catch {
      // Remove failed files
      setAttachedFiles(prev => prev.filter(f => !newAttached.some(na => na.file === f.file)));
    } finally {
      setIsUploadingFiles(false);
    }
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setAttachedFiles(prev => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleSendMessage = async () => {
    const hasContent = messageInput.trim();
    const hasFiles = attachedFiles.length > 0;
    if ((!hasContent && !hasFiles) || isSendingMessage || isUploadingFiles) return;
    // All files must be uploaded before sending
    if (attachedFiles.some(f => f.mediaId === undefined)) return;

    const content = messageInput;
    const mediaIds = attachedFiles.map(f => f.mediaId!);
    // Capture preview info before clearing (blob URLs still valid until revoked)
    const localPreviews: LocalPreview[] = attachedFiles.map(f => ({ url: f.previewUrl, type: f.type }));

    setMessageInput('');
    setAttachedFiles([]);
    // Note: blob URLs not revoked here so parent can use them for optimistic preview

    await onSendMessage(content, mediaIds.length > 0 ? mediaIds : undefined, localPreviews.length > 0 ? localPreviews : undefined);
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
          const uniqueKey = `${message.id}-${message.senderId}-${message.createdAt}-${index}`;
          return (
            <div key={uniqueKey} className={`flex gap-3 ${isFromPartner ? 'justify-start' : 'justify-end'}`}>
              {isFromPartner && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={message.senderAvatarUrl} />
                  <AvatarFallback>{message.senderName?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-sm min-w-0 flex flex-col gap-1 ${isFromPartner ? 'items-start' : 'items-end'}`}>
                {/* Media attachments */}
                {message.medias && message.medias.length > 0 && (
                  <MediaGrid
                    items={message.medias.map(m => ({ url: m.url, type: m.type === 'VIDEO' ? 'video' : 'image' }))}
                    onImageClick={setLightboxUrl}
                  />
                )}

                {/* Optimistic local previews (before server response) */}
                {(message as any).__localPreviews && (
                  <MediaGrid
                    items={((message as any).__localPreviews as { url: string; type: 'image' | 'video' }[])}
                    onImageClick={setLightboxUrl}
                    faded
                  />
                )}

                {/* Text bubble */}
                {message.content && (
                  <div className={`px-4 py-2 rounded-lg ${isFromPartner ? 'bg-gray-200 text-gray-800' : 'bg-blue-500 text-white'}`}>
                    <p className="text-sm break-all whitespace-pre-wrap">{message.content}</p>
                  </div>
                )}
                <p className="text-xs text-gray-400 px-1">{getRelativeTime(message.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment previews */}
      {attachedFiles.length > 0 && (
        <div className="px-4 pt-3 pb-0 border-t">
          {isUploadingFiles && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Đang tải lên...</span>
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            {attachedFiles.map((f, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border bg-gray-100" style={{ width: 72, height: 72 }}>
                {f.type === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Film className="w-6 h-6 text-gray-500" />
                    <span className="absolute bottom-1 left-1 text-[10px] text-gray-600 truncate max-w-[60px]">{f.file.name}</span>
                  </div>
                ) : (
                  <img src={f.previewUrl} alt="preview" className="w-full h-full object-cover" />
                )}
                {/* Uploading overlay */}
                {f.mediaId === undefined && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(i)}
                  disabled={isUploadingFiles}
                  className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                {/* File size */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[9px] text-center py-0.5">
                  {(f.file.size / 1024).toFixed(0)} KB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex gap-2 items-end">
          {/* Attachment button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSendingMessage}
            className="p-2 h-9 w-9 flex-shrink-0 text-gray-500 hover:text-blue-500"
            title="Đính kèm ảnh / video"
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
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
            disabled={
              (!messageInput.trim() && attachedFiles.length === 0) ||
              isSendingMessage ||
              isUploadingFiles ||
              attachedFiles.some(f => f.mediaId === undefined)
            }
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isSendingMessage || isUploadingFiles ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setLightboxUrl(null)}
        >
          <img
            src={lightboxUrl}
            alt="full"
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-xl"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
            onClick={() => setLightboxUrl(null)}
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
