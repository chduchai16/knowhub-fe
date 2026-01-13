export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Thông báo</h1>
      
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-lg border p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">User {i}</span> đã thích bài viết của bạn
                </p>
                <p className="text-xs text-gray-500 mt-1">{i} giờ trước</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
