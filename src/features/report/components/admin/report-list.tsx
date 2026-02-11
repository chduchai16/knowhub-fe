"use client"

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search, X, MoreHorizontal, Eye, Trash2, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/shared/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { Report } from "../../models/report";
import { ReportService } from "../../services/report-service";
import { ReportStatus } from "../../models/report-status";
import { ReportType } from "../../models/report-type";
import { toast } from "sonner";

export function ReportList() {
    const [reports, setReports] = useState<Report[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState<string>("");
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [reportType, setReportType] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const debouncedKeyword = useDebounce(keyword, 500);
    const prevFiltersRef = useRef<string | null>(null);

    const hasActiveFilters = keyword !== "" || status !== undefined || reportType !== undefined;

    const clearFilters = () => {
        setKeyword("");
        setStatus(undefined);
        setReportType(undefined);
        setPage(1);
    };

    useEffect(() => {
        const currentFilters = JSON.stringify({ page, limit, debouncedKeyword, status, reportType });

        if (prevFiltersRef.current === currentFilters) {
            return;
        }
        prevFiltersRef.current = currentFilters;

        const fetchReports = async () => {
            setLoading(true);
            try {
                const response = await ReportService.getAllReports(page - 1, limit, debouncedKeyword, reportType, status);
                setReports(response.content);
                setTotalPages(response.info?.totalPages ?? 1);
                setTotalElements(response.info?.totalElements ?? 0);
            } catch (error) {
                console.error("ReportList: Fetch reports failed", error);
                toast.error("Không thể tải danh sách báo cáo");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [page, limit, debouncedKeyword, status, reportType]);

    const handleDeleteReport = async () => {
        if (!reportToDelete) return;
        setSubmitting(true);
        try {
            await ReportService.deleteReport(reportToDelete.id as number);
            toast.success("Xóa báo cáo thành công");
            setIsDeleteDialogOpen(false);
            setReports(prev => prev.filter(r => r.id !== reportToDelete.id));
            setTotalElements(prev => prev - 1);
        } catch (error) {
            toast.error("Lỗi khi xóa báo cáo");
        } finally {
            setSubmitting(false);
        }
    };

    const openDeleteDialog = (report: Report) => {
        setReportToDelete(report);
        setIsDeleteDialogOpen(true);
    };

    const getStatusBadgeColor = (status?: ReportStatus) => {
        switch (status) {
            case ReportStatus.PENDING:
                return "bg-yellow-100 text-yellow-800";
            case ReportStatus.REVIEWED:
                return "bg-blue-100 text-blue-800";
            case ReportStatus.RESOLVED:
                return "bg-green-100 text-green-800";
            case ReportStatus.REJECTED:
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusLabel = (status?: ReportStatus) => {
        switch (status) {
            case ReportStatus.PENDING:
                return "Chờ xử lý";
            case ReportStatus.REVIEWED:
                return "Đã xem xét";
            case ReportStatus.RESOLVED:
                return "Đã giải quyết";
            case ReportStatus.REJECTED:
                return "Từ chối";
            default:
                return status || "—";
        }
    };

    const getReportTypeLabel = (type?: ReportType) => {
        switch (type) {
            case ReportType.SPAM:
                return "Spam";
            case ReportType.HARASSMENT:
                return "Quấy rầy";
            case ReportType.INAPPROPRIATE:
                return "Không phù hợp";
            case ReportType.MISINFORMATION:
                return "Sai sự thật";
            case ReportType.COPYRIGHT_VIOLATION:
                return "Vi phạm bản quyền";
            case ReportType.OTHER:
                return "Khác";
            default:
                return type || "—";
        }
    };

    const getEntityTypeLabel = (type?: string) => {
        switch (type) {
            case "post":
                return "Bài viết";
            case "comment":
                return "Bình luận";
            case "user":
                return "Người dùng";
            default:
                return type || "—";
        }
    };

    const formatDate = (date?: string) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("vi-VN");
    };

    return (
        <>
        <div>
            {/* header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Quản lý Báo cáo</h1>
            </div>

            {/* filter */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 mt-6 flex flex-wrap items-center gap-4">
                <div className="relative w-full lg:w-[340px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                    <Input
                        type="search"
                        placeholder="Tìm kiếm báo cáo..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full rounded-lg bg-neutral-100 pl-8"
                    />
                </div>

                <div className="relative w-full sm:w-[180px]">
                    <Select value={status || "ALL"} onValueChange={(value) => setStatus(value === "ALL" ? undefined : value)}>
                        <SelectTrigger className="w-full rounded-lg bg-neutral-100">
                            <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả</SelectItem>
                            <SelectItem value={ReportStatus.PENDING}>Chờ xử lý</SelectItem>
                            <SelectItem value={ReportStatus.REVIEWED}>Đã xem xét</SelectItem>
                            <SelectItem value={ReportStatus.RESOLVED}>Đã giải quyết</SelectItem>
                            <SelectItem value={ReportStatus.REJECTED}>Từ chối</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative w-full sm:w-[180px]">
                    <Select value={reportType || "ALL"} onValueChange={(value) => setReportType(value === "ALL" ? undefined : value)}>
                        <SelectTrigger className="w-full rounded-lg bg-neutral-100">
                            <SelectValue placeholder="Chọn loại báo cáo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả</SelectItem>
                            <SelectItem value={ReportType.SPAM}>Spam</SelectItem>
                            <SelectItem value={ReportType.HARASSMENT}>Quấy rầy</SelectItem>
                            <SelectItem value={ReportType.INAPPROPRIATE}>Không phù hợp</SelectItem>
                            <SelectItem value={ReportType.MISINFORMATION}>Sai sự thật</SelectItem>
                            <SelectItem value={ReportType.COPYRIGHT_VIOLATION}>Vi phạm bản quyền</SelectItem>
                            <SelectItem value={ReportType.OTHER}>Khác</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Nút xóa bộ lọc */}
                {hasActiveFilters && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Xóa bộ lọc
                    </Button>
                )}
            </div>

            {/* main content */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm mt-6 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Người báo cáo</TableHead>
                            <TableHead>Loại báo cáo</TableHead>
                            <TableHead>Thực thể</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : reports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <AlertCircle className="h-8 w-8 text-gray-300" />
                                        <p>Không tìm thấy báo cáo nào.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium">#{report.id}</TableCell>
                                    <TableCell>
                                        <span className="text-sm">{report.reporterUsername || "—"}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">{getReportTypeLabel(report.reportType)}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {getEntityTypeLabel(report.reportedEntityType)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className={getStatusBadgeColor(report.status) + " inline-flex items-center rounded-full px-2 py-1 text-xs font-medium select-none"}>
                                            {getStatusLabel(report.status)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(report.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => router.push(`/admin/reports/${report.id}`)}>
                                                    <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => openDeleteDialog(report)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Xóa
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-end px-6 py-4 border-t bg-neutral-50/50">
                    <Pagination className="mx-0 w-auto">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (page > 1) setPage(page - 1);
                                    }}
                                    className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }).map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        href="#"
                                        isActive={page === i + 1}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(i + 1);
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
                                        if (page < totalPages) setPage(page + 1);
                                    }}
                                    className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>

        {/* Delete Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Hành động này không thể hoàn tác. Báo cáo sẽ bị xóa vĩnh viễn khỏi hệ thống.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteReport}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={submitting}
                    >
                        {submitting ? "Đang xóa..." : "Xác nhận xóa"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}
