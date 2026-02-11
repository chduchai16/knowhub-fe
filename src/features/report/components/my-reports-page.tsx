'use client';

import { useEffect, useState } from 'react';
import { ReportService } from '../services/report-service';
import { Report } from '../models/report';
import { ReportStatus } from '../models/report-status';
import { ReportTypeLabels } from '../models/report-type-labels';
import { getRelativeTime } from '@/shared/utils';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader} from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Flag, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/shared/components/ui/pagination";

export function MyReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 10;

    useEffect(() => {
        fetchReports();
    }, [page]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await ReportService.getMyReports(page, limit);
            setReports(response.content);
            setTotalPages(response.info?.totalPages ?? 0);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status?: ReportStatus) => {
        switch (status) {
            case 'PENDING':
                return { 
                    label: 'Đang chờ xử lý', 
                    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                    icon: <Clock className="w-3 h-3 mr-1" />
                };
            case 'REVIEWED':
                return { 
                    label: 'Đang xem xét', 
                    color: 'bg-blue-100 text-blue-700 border-blue-200',
                    icon: <AlertCircle className="w-3 h-3 mr-1" />
                };
            case 'RESOLVED':
                return { 
                    label: 'Đã giải quyết', 
                    color: 'bg-green-100 text-green-700 border-green-200',
                    icon: <CheckCircle2 className="w-3 h-3 mr-1" />
                };
            case 'REJECTED':
                return { 
                    label: 'Đã từ chối', 
                    color: 'bg-red-100 text-red-700 border-red-200',
                    icon: <XCircle className="w-3 h-3 mr-1" />
                };
            default:
                return { 
                    label: 'Chưa xác định', 
                    color: 'bg-gray-100 text-gray-700 border-gray-200',
                    icon: <AlertCircle className="w-3 h-3 mr-1" />
                };
        }
    };

    const getTargetLabel = (type?: string) => {
        switch (type?.toLowerCase()) {
            case 'post': return 'Bài viết';
            case 'comment': return 'Bình luận';
            case 'user': return 'Người dùng';
            default: return 'Nội dung';
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Flag className="w-6 h-6 text-red-500" />
                    Báo cáo của tôi
                </h1>
                <p className="text-muted-foreground">Theo dõi trạng thái các báo cáo bạn đã gửi.</p>
            </div>

            {loading && page === 0 ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <Card key={i}>
                            <CardHeader className="pb-2">
                                <Skeleton className="h-6 w-1/3" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : reports.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
                    <Flag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Bạn chưa gửi báo cáo nào.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reports.map((report) => {
                        const status = getStatusInfo(report.status);
                        return (
                            <Card key={report.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={status.color}>
                                            <span className="flex items-center">
                                                {status.icon}
                                                {status.label}
                                            </span>
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {getRelativeTime(report.createdAt)}
                                        </span>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        #{report.id}
                                    </span>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold">
                                                {getTargetLabel(report.reportedEntityType)}:
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {ReportTypeLabels[report.reportType!] || report.reportType}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border italic">
                                            "{report.description}"
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious 
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page > 0) setPage(page - 1);
                                            }}
                                            className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                    
                                    {[...Array(totalPages)].map((_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink 
                                                href="#"
                                                isActive={page === i}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setPage(i);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext 
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page < totalPages - 1) setPage(page + 1);
                                            }}
                                            className={page === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
