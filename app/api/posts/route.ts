import { db } from "@/db";
import { postsTable, authorsTable } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const posts = await db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        slug: postsTable.slug,
        excerpt: postsTable.excerpt,
        published: postsTable.published,
        authorId: postsTable.authorId,
        authorName: authorsTable.name,
      })
      .from(postsTable)
      .leftJoin(authorsTable, sql`${postsTable.authorId} = ${authorsTable.id}`)
      .orderBy(desc(postsTable.published));

    return Response.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
