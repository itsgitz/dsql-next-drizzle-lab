import { db } from "@/db";
import { authorsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return Response.json(
        { error: "Missing required field: name" },
        { status: 400 }
      );
    }

    const author = await db
      .insert(authorsTable)
      .values({ name })
      .returning();

    return Response.json(author[0], { status: 201 });
  } catch (error) {
    console.error("Error creating author:", error);
    return Response.json(
      { error: "Failed to create author" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name } = body;

    if (!id || !name) {
      return Response.json(
        { error: "Missing required fields: id, name" },
        { status: 400 }
      );
    }

    const author = await db
      .update(authorsTable)
      .set({
        name,
        updated: new Date(),
      })
      .where(eq(authorsTable.id, id))
      .returning();

    if (!author.length) {
      return Response.json({ error: "Author not found" }, { status: 404 });
    }

    return Response.json(author[0]);
  } catch (error) {
    console.error("Error updating author:", error);
    return Response.json(
      { error: "Failed to update author" },
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

    const author = await db
      .delete(authorsTable)
      .where(eq(authorsTable.id, id))
      .returning();

    if (!author.length) {
      return Response.json({ error: "Author not found" }, { status: 404 });
    }

    return Response.json({ message: "Author deleted successfully" });
  } catch (error) {
    console.error("Error deleting author:", error);
    return Response.json(
      { error: "Failed to delete author" },
      { status: 500 }
    );
  }
}
