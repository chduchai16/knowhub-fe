import { UserDetail } from "@/features/admin/pages/user-management/user/user-detail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <UserDetail userId={id} />;
}
