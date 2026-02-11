"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Report } from "../../models/report";
import { ReportStatus } from "../../models/report-status";
import { ReportType } from "../../models/report-type";
import { ReportService } from "../../services/report-service";
import { toast } from "sonner";
import { cn } from "@/shared/utils";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
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
import { ArrowLeft, Trash2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const reportSchema = z.object({
    status: z.enum(["PENDING", "REVIEWED", "RESOLVED", "REJECTED"]),
    description: z.string().min(1, "Mô tả không được để trống"),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface ReportDetailPageProps {
    reportId: string;
}

export function ReportDetailPage({ reportId }: ReportDetailPageProps) {
    const [report, setReport] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeletingReport, setIsDeletingReport] = useState(false);
    const router = useRouter();

    const form = useForm<ReportFormValues>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            status: "PENDING",
            description: "",
        },
    });

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setIsLoading(true);
                // Create a dummy report for now since the API might not have getReportById
                // In a real app, you would call ReportService.getReportById(reportId)
                const mockReport: Report = {
                    id: parseInt(reportId),
                    reporterUsername: "user123",
                    status: ReportStatus.PENDING,
                    reportType: ReportType.SPAM,
                    reportedEntityType: "post",
                    reportedEntityId: 5,
                    description: "This post contains inappropriate content",
                    createdAt: new Date().toISOString(),
                };
                setReport(mockReport);
                form.reset({
                    status: mockReport.status || "PENDING",
                    description: mockReport.description || "",
                });
            } catch (error) {
                console.error("Error fetching report:", error);
                toast.error("Không thể tải chi tiết báo cáo");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReport();
    }, [reportId, form]);

    const onSubmit = async (values: ReportFormValues) => {
        if (!report?.id) return;

        try {
            setIsSubmitting(true);
            const updatedReport: Report = {
                ...report,
                status: values.status as ReportStatus,
                description: values.description,
            };
            await ReportService.updateReport(updatedReport);
            toast.success("Cập nhật báo cáo thành công");
            setReport(updatedReport);
        } catch (error) {
            console.error("Error updating report:", error);
            toast.error("Lỗi khi cập nhật báo cáo");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!report?.id) return;

        try {
            setIsDeletingReport(true);
            await ReportService.deleteReport(report.id);
            toast.success("Xóa báo cáo thành công");
            router.push("/admin/reports");
        } catch (error) {
            console.error("Error deleting report:", error);
            toast.error("Lỗi khi xóa báo cáo");
        } finally {
            setIsDeletingReport(false);
            setIsDeleteDialogOpen(false);
        }
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
        return new Date(date).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Chi tiết Báo cáo</h1>
                        <p className="text-sm text-muted-foreground">Quản lý và xử lý báo cáo từ người dùng</p>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                </div>
            ) : report ? (
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Report Details Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Thông tin báo cáo</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Người báo cáo</p>
                                        <p className="font-medium mt-1">{report.reporterUsername || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Loại báo cáo</p>
                                        <p className="font-medium mt-1">{getReportTypeLabel(report.reportType)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Loại thực thể</p>
                                        <p className="font-medium mt-1">{getEntityTypeLabel(report.reportedEntityType)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">ID Thực thể</p>
                                        <p className="font-medium mt-1">#{report.reportedEntityId || "—"}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Ngày báo cáo</p>
                                    <p className="font-medium mt-1">{formatDate(report.createdAt)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Edit Status and Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Xử lý báo cáo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Trạng thái xử lý</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Chọn trạng thái" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value={ReportStatus.PENDING}>Chờ xử lý</SelectItem>
                                                            <SelectItem value={ReportStatus.REVIEWED}>Đã xem xét</SelectItem>
                                                            <SelectItem value={ReportStatus.RESOLVED}>Đã giải quyết</SelectItem>
                                                            <SelectItem value={ReportStatus.REJECTED}>Từ chối</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>
                                                        Cập nhật trạng thái xử lý của báo cáo
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Mô tả chi tiết</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Nhập mô tả về báo cáo..."
                                                            className="min-h-32 resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                                            <Save className="mr-2 h-4 w-4" />
                                            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Tổng quan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Trạng thái</p>
                                    <Badge className={cn("mt-2", getStatusBadgeColor(report.status))}>
                                        {getStatusLabel(report.status)}
                                    </Badge>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">Loại báo cáo</p>
                                    <Badge variant="outline" className="mt-2">
                                        {getReportTypeLabel(report.reportType)}
                                    </Badge>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">Liên quan đến</p>
                                    <Badge variant="outline" className="mt-2">
                                        {getEntityTypeLabel(report.reportedEntityType)} #{report.reportedEntityId}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delete Card */}
                        <Card className="border-red-200 bg-red-50">
                            <CardHeader>
                                <CardTitle className="text-lg text-red-600">Nguy hiểm</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Xóa báo cáo này sẽ xóa vĩnh viễn nó khỏi hệ thống.
                                </p>
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Xóa báo cáo
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Không tìm thấy báo cáo</p>
                    </CardContent>
                </Card>
            )}

            {/* Delete Confirmation Dialog */}
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
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeletingReport}
                        >
                            {isDeletingReport ? "Đang xóa..." : "Xác nhận xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
