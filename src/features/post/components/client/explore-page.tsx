export function ExplorePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Khám phá</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100" />
            <div className="p-4">
              <h3 className="font-semibold mb-1">Chủ đề {i}</h3>
              <p className="text-sm text-gray-500">1.2k bài viết</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
