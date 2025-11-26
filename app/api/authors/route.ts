import { db } from "@/db";
import { authorsTable } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const authors = await db
      .select()
      .from(authorsTable)
      .orderBy(desc(authorsTable.created));

    return Response.json(authors);
  } catch (error) {
    console.error("Error fetching authors:", error);
    return Response.json(
      { error: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}
