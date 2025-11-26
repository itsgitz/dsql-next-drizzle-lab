"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PostForm } from "@/app/components/PostForm";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  authorId: string | null;
}

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  async function fetchPost() {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const posts = await response.json();
      const foundPost = posts.find((p: BlogPost) => p.id === id);

      if (!foundPost) throw new Error("Post not found");

      setPost(foundPost);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black dark:text-white mb-4">
              Post not found
            </h1>
            <a
              href="/admin/posts"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Back to posts
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PostForm
      initialData={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || "",
        authorId: post.authorId || "",
      }}
      isEditing={true}
    />
  );
}
