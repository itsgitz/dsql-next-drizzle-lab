import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { generateToken } from "./auth";
import * as schema from "@/db/schema";

export const pool = new Pool({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    database: process.env.DB_DATABASE!,
    password: await generateToken(),
    ssl: true,
});
export const db = drizzle({ client: pool, schema });
