export function PermissionList() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Quản lý Quyền</h1>
                <p className="text-sm text-muted-foreground">Quản lý danh sách quyền hạn truy cập trong hệ thống.</p>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                    <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-blue-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Danh sách Quyền</h3>
                        <p className="text-muted-foreground max-w-sm mt-1">Chức năng đang được phát triển. Vui lòng quay lại sau.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
