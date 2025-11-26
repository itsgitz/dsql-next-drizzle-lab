"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: Date | null;
  updated: Date | null;
  authorName: string | null;
}

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  async function fetchPost() {
    try {
      const response = await fetch(`/api/posts/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch post");
      const data = await response.json();
      setPost(data);
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
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Back to blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block"
        >
          ← Back to blog
        </Link>

        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              {post.published && (
                <time>
                  Published:{" "}
                  {new Date(post.published).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              {post.updated && (
                <time>
                  Updated:{" "}
                  {new Date(post.updated).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              {post.authorName && (
                <div>
                  By <span className="font-medium text-gray-700 dark:text-gray-300">{post.authorName}</span>
                </div>
              )}
            </div>
          </header>

          <div className="prose dark:prose-invert max-w-none">
            <div className="text-gray-800 dark:text-gray-200 leading-7 whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
