import { generateToken } from "../db/auth";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

async function updateEnv() {
    try {
        const token = await generateToken();
        const envPath = resolve(".env");

        let envContent = "";
        if (existsSync(envPath)) {
            envContent = readFileSync(envPath, "utf-8");
        }

        const envLines = envContent.split("\n").filter((line) => line.trim());
        const filtered = envLines.filter(
            (line) => !line.startsWith("DB_PASSWORD="),
        );
        filtered.push(`DB_PASSWORD=${token}`);

        writeFileSync(envPath, filtered.join("\n") + "\n");
        console.log("DB_PASSWORD updated in .env");
    } catch (error) {
        console.error("Failed to update .env:", error);
        process.exit(1);
    }
}

updateEnv();
