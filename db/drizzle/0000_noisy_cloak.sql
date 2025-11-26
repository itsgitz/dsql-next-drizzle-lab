CREATE SCHEMA "drizzle_lab";
--> statement-breakpoint
CREATE TABLE "drizzle_lab"."authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"created" timestamp DEFAULT now(),
	"updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "drizzle_lab"."posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"excerpt" varchar(500),
	"author_id" uuid,
	"published" timestamp DEFAULT now(),
	"updated" timestamp DEFAULT now(),
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
