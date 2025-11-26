import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./db/drizzle",
    schema: "./db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        // url: process.env.DATABASE_URL!,
        host: process.env.DB_HOST!,
        user: process.env.DB_USER!,
        database: process.env.DB_DATABASE!,
        password: process.env.DB_PASSWORD,
        ssl: true,
    },
});
