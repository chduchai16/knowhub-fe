'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import Link from 'next/link';
import { ImageCropper } from '@/shared/components/image-cropper';

export function CreatePostPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [tempImage, setTempImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating post:', content);
    router.push('/feed');
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
          // clear input value to allow selecting same file again
          e.target.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
  }

  const handleRemoveImage = () => {
    setImage('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

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
                    {!image && (
                        <Button type="button" variant="outline" size="sm" onClick={openFileExplorer}>
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Thêm ảnh
                        </Button>
                    )}
                    {image && (
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
            
            <div className="flex items-center justify-end gap-2">
                <Link href="/feed">
                  <Button type="button" variant="outline">
                    Hủy
                  </Button>
                </Link>
                <Button type="submit" disabled={!content.trim()} className='bg-blue-500 hover:bg-blue-600'>
                  Đăng bài
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={(croppedImage) => {
            setImage(croppedImage);
            setTempImage('');
          }}
          onCancel={() => setTempImage('')}
        />
      )}
    </div>
  );
}
