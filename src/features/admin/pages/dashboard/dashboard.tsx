export function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Tổng quan về hệ thống và các chỉ số thống kê.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats Cards */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Tổng người dùng</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </div>
                    <div className="text-2xl font-bold">10,482</div>
                    <p className="text-xs text-muted-foreground">+20.1% so với tháng trước</p>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Bài viết mới</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-muted-foreground"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                    </div>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">+180.1% so với tuần trước</p>
                </div>

                {/* Placeholders for other stats */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 opacity-60">
                    <h3 className="tracking-tight text-sm font-medium">Đang phát triển...</h3>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 opacity-60">
                    <h3 className="tracking-tight text-sm font-medium">Đang phát triển...</h3>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <h3 className="text-lg font-semibold">Biểu đồ thống kê</h3>
                    <p className="text-muted-foreground">Sẽ sớm cập nhật biểu đồ tại đây.</p>
                </div>
            </div>
        </div>
    );
}
