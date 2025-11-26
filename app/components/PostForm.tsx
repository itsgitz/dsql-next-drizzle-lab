"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PostFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
  };
  isEditing?: boolean;
}

export function PostForm({ initialData, isEditing = false }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const method = isEditing ? "PUT" : "POST";
      const body = isEditing
        ? {
            id: initialData?.id,
            ...formData,
          }
        : formData;

      const response = await fetch("/api/posts/manage", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed to ${isEditing ? "update" : "create"} post`);
      }

      router.push("/admin/posts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
          {isEditing ? "Edit Post" : "Create New Post"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {isEditing ? "Update your post content" : "Write and publish a new blog post"}
        </p>

        <Link
          href="/admin/posts"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block"
        >
          ← Back to posts
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Post title"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="url-friendly-slug"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Used in the URL: example.com/{formData.slug}
            </p>
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Excerpt (optional)
            </label>
            <input
              type="text"
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Short summary of your post"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Write your post content here..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Post"
                  : "Create Post"}
            </button>
            <Link
              href="/admin/posts"
              className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
