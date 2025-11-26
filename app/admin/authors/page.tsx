"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Author {
  id: string;
  name: string;
  created: Date;
}

export default function AdminAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAuthorName, setNewAuthorName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAuthors();
  }, []);

  async function fetchAuthors() {
    try {
      const response = await fetch("/api/authors");
      if (!response.ok) throw new Error("Failed to fetch authors");
      const data = await response.json();
      setAuthors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function createAuthor(e: React.FormEvent) {
    e.preventDefault();
    if (!newAuthorName.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/authors/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAuthorName }),
      });

      if (!response.ok) throw new Error("Failed to create author");

      const author = await response.json();
      setAuthors([author, ...authors]);
      setNewAuthorName("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create author");
    } finally {
      setSubmitting(false);
    }
  }

  async function updateAuthor(id: string) {
    if (!editingName.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/authors/manage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editingName }),
      });

      if (!response.ok) throw new Error("Failed to update author");

      const updated = await response.json();
      setAuthors(authors.map((a) => (a.id === id ? updated : a)));
      setEditingId(null);
      setEditingName("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update author");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteAuthor(id: string) {
    if (!confirm("Are you sure you want to delete this author?")) return;

    try {
      const response = await fetch("/api/authors/manage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete author");

      setAuthors(authors.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete author");
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
            Admin - Authors
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Manage blog authors
          </p>
        </div>

        <div className="mb-8">
          <Link
            href="/admin/posts"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to posts
          </Link>
        </div>

        {/* Create Author Form */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
            Add New Author
          </h2>
          <form onSubmit={createAuthor} className="flex gap-2">
            <input
              type="text"
              value={newAuthorName}
              onChange={(e) => setNewAuthorName(e.target.value)}
              placeholder="Author name"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={submitting || !newAuthorName.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {submitting ? "Adding..." : "Add Author"}
            </button>
          </form>
        </div>

        {loading && (
          <div className="text-center text-gray-600 dark:text-gray-400">
            Loading authors...
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 dark:text-red-400">
            Error: {error}
          </div>
        )}

        {!loading && authors.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400">
            No authors yet. Create your first author!
          </div>
        )}

        {!loading && authors.length > 0 && (
          <div className="space-y-3">
            {authors.map((author) => (
              <div
                key={author.id}
                className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                {editingId === author.id ? (
                  <div className="flex-1 flex gap-2 items-center">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                      autoFocus
                    />
                    <button
                      onClick={() => updateAuthor(author.id)}
                      disabled={submitting}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-600 dark:text-gray-400 hover:underline text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white font-medium">
                        {author.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Created:{" "}
                        {new Date(author.created).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(author.id);
                          setEditingName(author.name);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteAuthor(author.id)}
                        className="text-red-600 dark:text-red-400 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
