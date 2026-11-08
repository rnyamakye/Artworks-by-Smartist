import BlogDetailClient from "./BlogDetailClient";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  return <BlogDetailClient key={id} id={id} />;
}
