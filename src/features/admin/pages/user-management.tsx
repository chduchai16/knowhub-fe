import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

export function UserManagement() {
    return (
        <div>
            {/* header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h1>
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm người dùng
                </Button>
            </div>

            {/* filter */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 mt-6 flex items-center gap-4 grid grid-cols-12">
                <div className="relative col-span-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm theo tên"
                            className="w-full rounded-lg bg-neutral-100 dark:bg-neutral-800 pl-8"
                        />
                    </div>
                <div className="relative col-span-3">
                    <Select>
                        <SelectTrigger className="w-full rounded-lg bg-neutral-100 dark:bg-neutral-800 pl-8">
                            <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admin">Quản trị viên (admin)</SelectItem>
                            <SelectItem value="user">Người dùng (user)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="relative flex gap-3 col-span-5 justify-end">
                    <Button variant="outline">Tất cả</Button>
                    <Button variant="outline">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Hoạt động
                    </Button>
                    <Button variant="outline">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Không hoạt động
                    </Button>
                    <Button variant="outline">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                        Khóa
                    </Button>
                </div>
            </div>

            {/* main content */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 mt-6">
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                    <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-blue-500"><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" /></svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Danh sách người dùng</h3>
                        <p className="text-muted-foreground max-w-sm mt-1">Chức năng đang được phát triển. Vui lòng quay lại sau.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}