'use client';

import { useUser } from '@/shared/hooks/use-user';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { UserService } from '@/features/user/services/user-service';
import { toast } from 'sonner';
import { ImageCropper } from '@/shared/components/common/image-cropper';
import { MediaService } from '@/shared/services/media.service';

export function EditProfilePage() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tempAvatar, setTempAvatar] = useState('');
  const [loadingUploadAvatar, setLoadingUploadAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    id: user?.id,
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth || '',
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedUser = await UserService.updateProfile(formData);
      setUser({ ...user, ...updatedUser } as any);
      toast.success('Cập nhật hồ sơ thành công');
      router.refresh();
      router.push('/profile');
    } catch (error) {
      toast.error('Cập nhật hồ sơ thất bại');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openAvatarExplorer = () => {
    avatarInputRef.current?.click();
  };

  const onAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setTempAvatar(result);
          e.target.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarCropComplete = async (croppedBlob: Blob, previewUrl: string) => {
    setTempAvatar('');
    setLoadingUploadAvatar(true);
    
    const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });
    
    try {
      const avatarUrl = await MediaService.uploadAvatar(file);
      if (avatarUrl) {
        setUser({ ...user, avatarUrl } as any);
        toast.success('Cập nhật ảnh đại diện thành công');
      }
    } catch (error) {
      toast.error('Lỗi khi tải ảnh lên');
    } finally {
      setLoadingUploadAvatar(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Chỉnh sửa hồ sơ</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatarUrl || undefined} alt={user.fullName || 'User'} />
              <AvatarFallback className="text-2xl">
                {user.fullName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            {loadingUploadAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            )}
          </div>
          <div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={openAvatarExplorer}
              disabled={loadingUploadAvatar}
            >
              <Upload className="w-4 h-4 mr-2" />
              Thay đổi ảnh
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              JPG, PNG hoặc GIF. Tối đa 2MB
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={avatarInputRef}
            onChange={onAvatarFileChange}
            className="hidden"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Tên người dùng</Label>
          <Input
            id="username"
            value={user.username || ''}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Không thể thay đổi tên người dùng
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={user.email || ''}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Họ và tên</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Nhập họ và tên của bạn"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Tiểu sử</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Giới thiệu về bản thân"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Giới tính</Label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Chọn giới tính</option>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Ngày sinh</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
        </div>

        <div className="pt-4 border-t space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Bài viết</p>
              <p className="font-semibold">{user.postQuantity || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Người theo dõi</p>
              <p className="font-semibold">{user.followerQuantity || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Đang theo dõi</p>
              <p className="font-semibold">{user.followingQuantity || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Vai trò</p>
              <p className="font-semibold">{user.roleName}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
          >
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Hủy
          </Button>
        </div>
      </form>

      {tempAvatar && (
        <ImageCropper
          image={tempAvatar}
          onCropComplete={handleAvatarCropComplete}
          onCancel={() => setTempAvatar('')}
        />
      )}
    </div>
  );
}
