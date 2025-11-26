import { db } from "@/db";
import { postsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt } = body;

    if (!title || !slug || !content) {
      return Response.json(
        { error: "Missing required fields: title, slug, content" },
        { status: 400 }
      );
    }

    const post = await db
      .insert(postsTable)
      .values({
        title,
        slug,
        content,
        excerpt: excerpt || null,
      })
      .returning();

    return Response.json(post[0], { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return Response.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, slug, content, excerpt } = body;

    if (!id) {
      return Response.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const post = await db
      .update(postsTable)
      .set({
        title: title || undefined,
        slug: slug || undefined,
        content: content || undefined,
        excerpt: excerpt !== undefined ? excerpt : undefined,
        updated: new Date(),
      })
      .where(eq(postsTable.id, id))
      .returning();

    if (!post.length) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    return Response.json(post[0]);
  } catch (error) {
    console.error("Error updating post:", error);
    return Response.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return Response.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const post = await db
      .delete(postsTable)
      .where(eq(postsTable.id, id))
      .returning();

    if (!post.length) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    return Response.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return Response.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
