"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: Date | null;
  authorName: string | null;
}

export default function BlogHome() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex">
            <div>
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                Blog
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Read my latest posts
              </p>
            </div>
            <div className="ml-auto">
              <Link
                href="/admin/posts"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Admin Page
              </Link>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-600 dark:text-gray-400">
            Loading posts...
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 dark:text-red-400">
            Error: {error}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400">
            No posts yet
          </div>
        )}

        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/${post.slug}`} className="block group">
              <article className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-md dark:hover:shadow-md dark:hover:shadow-gray-800 transition-shadow">
                <h2 className="text-2xl font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
                  {post.published && (
                    <time>
                      {new Date(post.published).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  )}
                  {post.authorName && (
                    <div className="text-gray-500 dark:text-gray-500">
                      By <span className="font-medium text-gray-700 dark:text-gray-300">{post.authorName}</span>
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
