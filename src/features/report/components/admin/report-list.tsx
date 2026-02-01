export function ReportList() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Quản lý tố cáo</h1>
                <p className="text-sm text-muted-foreground">Theo dõi tố cáo của hệ thống và người dùng.</p>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                    <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-blue-500"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Nhật ký tố cáo</h3>
                        <p className="text-muted-foreground max-w-sm mt-1">Chức năng đang được phát triển. Vui lòng quay lại sau.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
