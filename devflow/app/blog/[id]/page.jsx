import { blogPosts } from '../../../src/data/blogPosts';
import DashboardView from '../../../src/components/DashboardView';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id,
  }));
}

export default async function BlogPostPage({ params }) {
  const { id } = await params;
  return <DashboardView initialTab="blog-post" activeBlogId={id} />;
}
