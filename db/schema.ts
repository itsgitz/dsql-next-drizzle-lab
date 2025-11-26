import { pgTable, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Authors table
// - id: random UUID
// - name: Author name (required)
// - created & updated: Timestamps for tracking
export const authorsTable = pgTable("authors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  created: timestamp().defaultNow(),
  updated: timestamp().defaultNow(),
});

// Posts table
// - id: random UUID
// - title: Post title (required)
// - slug: URL-friendly identifier (required, unique)
// - content: Full post content (required)
// - excerpt: Short summary (optional)
// - authorId: Foreign key to authors table
// - published & updated: Timestamps for tracking
export const postsTable = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  content: text().notNull(),
  excerpt: varchar({ length: 500 }),
  authorId: uuid("author_id"),
  published: timestamp().defaultNow(),
  updated: timestamp().defaultNow(),
});

// Relations
export const postsRelations = relations(postsTable, ({ one }) => ({
  author: one(authorsTable, {
    fields: [postsTable.authorId],
    references: [authorsTable.id],
  }),
}));

export const authorsRelations = relations(authorsTable, ({ many }) => ({
  posts: many(postsTable),
}));
