import { db } from "@/db";
import { postsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.slug, slug))
      .limit(1);

    if (!post.length) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    return Response.json(post[0]);
  } catch (error) {
    console.error("Error fetching post:", error);
    return Response.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
