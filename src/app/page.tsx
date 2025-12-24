// app/page.tsx (Next.js App Router)
import { Button } from "@/shared/components/ui/button";
import { Home as HomeIcon, User } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 space-y-6 p-6">
      {/* Tiêu đề */}
      <h1 className="text-4xl font-bold">Xin chào thế giới 🌎</h1>

      {/* Lucide icon */}
      <div className="flex gap-4 text-blue-500">
        <HomeIcon className="w-10 h-10" />
        <User className="w-10 h-10" />
      </div>

      {/* ShadCN button */}
      <Button className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2">
        <HomeIcon className="w-5 h-5" />
        Nhấn tôi
      </Button>

      {/* Một ví dụ khác dùng Tailwind + ShadCN */}
      <div className="p-4 border border-gray-300 rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-800">
        <p className="text-lg">Đây là card demo Tailwind + ShadCN.</p>
      </div>
    </div>
  );
}
