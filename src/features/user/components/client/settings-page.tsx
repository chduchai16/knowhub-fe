export function SettingsPage() {
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
      </div>
    </div>
  );
}
