import { notFound } from "next/navigation";
import { getPost } from "@/lib/db/content";
import { BlogForm } from "../BlogForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();
  return <BlogForm post={post} />;
}
