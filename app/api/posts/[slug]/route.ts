import { db } from "@/db";
import { postsTable, authorsTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const post = await db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        slug: postsTable.slug,
        content: postsTable.content,
        excerpt: postsTable.excerpt,
        published: postsTable.published,
        updated: postsTable.updated,
        authorId: postsTable.authorId,
        authorName: authorsTable.name,
      })
      .from(postsTable)
      .leftJoin(authorsTable, sql`${postsTable.authorId} = ${authorsTable.id}`)
      .where(eq(postsTable.slug, slug))
      .limit(1);

    if (!post.length) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    return Response.json(post[0]);
  } catch (error) {
    console.error("Error fetching post:", error);
    return Response.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
