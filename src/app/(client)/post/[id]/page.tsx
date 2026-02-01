import { PostDetailPage } from '@/features/post/components/client/post-detail-page';

export default function PostPage({ params }: { params: { id: string } }) {
  return <PostDetailPage postId={params.id} />;
}
