import { PostDetailPage } from '@/features/post/components/client/post-detail-page';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PostDetailPage postId={id} />;
}
