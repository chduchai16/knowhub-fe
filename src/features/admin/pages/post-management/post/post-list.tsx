export function PostList() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Quản lý Bài viết</h1>
                <p className="text-sm text-muted-foreground">Quản lý, kiểm duyệt và theo dõi các bài đăng.</p>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                    <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-blue-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Danh sách Bài viết</h3>
                        <p className="text-muted-foreground max-w-sm mt-1">Chức năng đang được phát triển. Vui lòng quay lại sau.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
