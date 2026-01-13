export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">Tên người dùng</h1>
            <p className="text-gray-500 mb-4">@username</p>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="font-semibold">128</span> bài viết
              </div>
              <div>
                <span className="font-semibold">1.2k</span> người theo dõi
              </div>
              <div>
                <span className="font-semibold">456</span> đang theo dõi
              </div>
            </div>
          </div>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Chỉnh sửa hồ sơ
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded hover:opacity-75 transition-opacity cursor-pointer" />
        ))}
      </div>
    </div>
  );
}
