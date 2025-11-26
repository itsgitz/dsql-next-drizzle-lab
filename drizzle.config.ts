import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// `serial` data type currently is not supported by Amazon Aurora DSQL
// so we cannot run the migrations using `drizzle-kit migrate`
export default defineConfig({
  out: "./db/drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    database: process.env.DB_DATABASE!,
    password: process.env.DB_PASSWORD,
    ssl: true,
  },
  schemaFilter: "drizzle_lab",
});
