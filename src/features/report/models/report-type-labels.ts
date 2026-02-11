import { ReportType } from "./report-type";

export const ReportTypeLabels: Record<ReportType, string> = {
    [ReportType.SPAM]: "Nội dung spam",
    [ReportType.HARASSMENT]: "Quấy rối, xúc phạm",
    [ReportType.INAPPROPRIATE]: "Nội dung không phù hợp",
    [ReportType.MISINFORMATION]: "Thông tin sai lệch",
    [ReportType.COPYRIGHT_VIOLATION]: "Vi phạm bản quyền",
    [ReportType.OTHER]: "Khác"
};