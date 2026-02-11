import { PostDetailPage } from "@/features/post/components/admin/post-detail-page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <PostDetailPage postId={id} />;
}
