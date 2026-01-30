'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ArrowLeft, Image as ImageIcon, X, Loader2, Globe, Lock, Users } from 'lucide-react';
import Link from 'next/link';
import { ImageCropper } from '@/shared/components/image-cropper';
import { MediaService } from '@/shared/services/media.service';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';

export function CreatePostPage() {
  const router = useRouter();
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tempImage, setTempImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loadingUploadImage , setLoadingUploadImage] = useState(false);
  const [loadingCreatePost , setLoadingCreatePost] = useState(false);
  
  // dữ liệu gửi về backend 
  const [mediaId, setMediaId] = useState<number | null>(null);
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState<'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY'>('PUBLIC');

  // hàm đăng bài 
  const handleSubmit = async (e: React.FormEvent) => {
    setLoadingCreatePost(true);
    e.preventDefault();

    const payload : Post = {
      mediaIds : [mediaId ?? 0],
      content : content,
      privacy : privacy ,
      status : 'published'
    }

    try {
      await PostService.createPost(payload);
      toast.success('Đăng bài thành công');
      router.push('/feed');
    } catch (error) {
      toast.error('Lỗi khi đăng bài');
    } finally {
      setLoadingCreatePost(false);
    }
  };

  // mở explorer
  const openFileExplorer = () => {
    fileInputRef.current?.click();
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setTempImage(result);
          e.target.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // gỡ ảnh đã chọn
  const handleRemoveImage = () => {
    setImage('');
    setImageFile(null);
    setMediaId(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const handleCropComplete = async (croppedBlob: Blob, previewUrl: string) => {
    // Đóng modal ngay lập tức
    setTempImage('');
    setLoadingUploadImage(true);
    // chuyển thanh file
    const file = new File([croppedBlob], 'post-image.jpg', { type: 'image/jpeg' });
    try {
      const response : any = await MediaService.uploadTempImage(file);
      if (response) {
        setMediaId(response);
      }
      setImage(previewUrl);
      setImageFile(file);
    } catch (error) {
      toast.error('Lỗi khi tải ảnh lên');
    } finally {
      setLoadingUploadImage(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Link href="/feed">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <CardTitle>Tạo bài viết mới</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className='flex gap-4'>
                <div className="group relative flex items-center gap-2 min-h-[200px] min-w-[200px] border border-gray-200 rounded-md justify-center overflow-hidden">
                    {!image && !loadingUploadImage && (
                        <Button type="button" variant="outline" size="sm" onClick={openFileExplorer}>
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Thêm ảnh
                        </Button>
                    )}
                    {loadingUploadImage && (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            <span className="text-sm text-gray-500">Đang tải ảnh lên...</span>
                        </div>
                    )}
                    {image && !loadingUploadImage && (
                        <>
                            <img src={image} alt="Preview" className="max-w-full max-h-[200px] flex-1 object-cover" />
                            <Button 
                                type="button" 
                                variant="secondary" 
                                size="icon" 
                                className="absolute top-1 right-1 rounded-full w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-200/80 hover:bg-gray-300 text-gray-600 shadow-sm"
                                onClick={handleRemoveImage}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </>
                    )}
                </div>

                <Textarea
                placeholder="Bạn đang nghĩ gì?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] resize-none flex-1"
                />
              <input
                type="file"
                accept='image/*'
                ref={fileInputRef}
                onChange={onFileChange}
                className="hidden"
              />
            </div>
            
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Quyền riêng tư:</span>
                    <Select value={privacy} onValueChange={(value: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY') => setPrivacy(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PUBLIC">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    <span>Công khai</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="FRIENDS_ONLY">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>Bạn bè</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="PRIVATE">
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    <span>Riêng tư</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                <Link href="/feed">
                  <Button type="button" variant="outline">
                    Hủy
                  </Button>
                </Link>
                <Button type="submit" disabled={(!content.trim() && !mediaId) || loadingCreatePost} className='bg-blue-500 hover:bg-blue-600'>
                  {loadingCreatePost ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang đăng...
                    </>
                  ) : (
                    'Đăng bài'
                  )}
                </Button>
                </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setTempImage('')}
        />
      )}
    </div>
  );
}
