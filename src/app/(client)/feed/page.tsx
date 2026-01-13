export default function FeedPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bảng tin</h1>
      </div>

      {/* Feed content sẽ được implement sau */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div>
                <p className="font-semibold">User {i}</p>
                <p className="text-sm text-gray-500">2 giờ trước</p>
              </div>
            </div>
            <p className="text-gray-700">
              Đây là nội dung bài viết mẫu số {i}. Nội dung thực sẽ được load từ API.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <button className="hover:text-blue-500">Thích</button>
              <button className="hover:text-blue-500">Bình luận</button>
              <button className="hover:text-blue-500">Chia sẻ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
