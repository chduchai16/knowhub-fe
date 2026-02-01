import { UserDetail } from "@/features/user/components/admin/user-detail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <UserDetail userId={id} />;
}
