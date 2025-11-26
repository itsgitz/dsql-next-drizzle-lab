// scripts/migrate.ts
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "@/db";

async function runMigrations() {
    await pool.connect();

    try {
        // 3. Initialize Drizzle and run migrations

        await migrate(db, {
            migrationsFolder: "../db/drizzle",
        });

        console.log("Migrations completed successfully");
    } finally {
        await pool.end();
    }
}

runMigrations().catch(console.error);
