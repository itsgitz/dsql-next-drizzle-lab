import { pgTable, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";

// - id: random UUID
// - title: Post title (required)
// - slug: URL-friendly identifier (required, unique)
// - content: Full post content (required)
// - excerpt: Short summary (optional)
// - published & updated: Timestamps for tracking
export const postsTable = pgTable("posts", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull().unique(),
    content: text().notNull(),
    excerpt: varchar({ length: 500 }),
    published: timestamp().defaultNow(),
    updated: timestamp().defaultNow(),
});
