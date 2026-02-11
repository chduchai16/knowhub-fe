'use client';

import { Button } from '@/shared/components/ui/button';
import { LogOut, ChevronRight, Flag, ShieldCheck } from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/shared/hooks/use-user';

export function SettingsPage() {
  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.roleName?.toUpperCase() === 'ADMIN';

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Cài đặt</h1>

      <div className="space-y-4">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="font-semibold mb-4">Tài khoản</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Email</span>
              <span className="text-sm text-gray-500">user@example.com</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Tên người dùng</span>
              <span className="text-sm text-gray-500">@username</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="font-semibold mb-4">Quyền riêng tư</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Tài khoản riêng tư</span>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Hiển thị hoạt động</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="font-semibold mb-4">Thông báo</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Thông báo email</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Thông báo push</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="font-semibold mb-4">Hỗ trợ & Báo cáo</h2>
          <div className="space-y-1">
            <Link 
              href="/settings/reports" 
              className="flex justify-between items-center py-3 px-2 hover:bg-gray-50 rounded-md transition-colors"
            >
              <div className="flex items-center gap-3">
                <Flag className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Báo cáo của tôi</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white rounded-lg border p-6 border-blue-100 bg-blue-50/10">
            <h2 className="font-semibold mb-4 text-blue-700">Quản trị viên</h2>
            <div className="space-y-1">
              <Link 
                href="/admin/dashboard" 
                className="flex justify-between items-center py-3 px-2 hover:bg-blue-50 rounded-md transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Trang quản trị (Admin Dashboard)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-400" />
              </Link>
            </div>
          </div>
        )}

          <Button
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất khỏi thiết bị này
          </Button>
      </div>
    </div>
  );
}
