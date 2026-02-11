import { ReportDetailPage } from "@/features/report/components/admin";

export default async function ReportDetailPageRoute({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ReportDetailPage reportId={id} />;
}
