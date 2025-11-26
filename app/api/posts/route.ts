import { db } from "@/db";
import { postsTable } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const posts = await db
      .select()
      .from(postsTable)
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
