import { notFound } from "next/navigation";
import { getPost } from "@/lib/db/content";
import { PostForm } from "../PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();
  return <PostForm post={post} />;
}
