import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const key = process.env.GEMINI_API_KEY || process.env.GEMINI_API_SECRET;

if (!key) {
    fs.writeFileSync("results.json", JSON.stringify({ error: "Missing API Key" }));
    process.exit(1);
}

async function listModels() {
    try {
        console.log("Fetching models...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();
        fs.writeFileSync("results.json", JSON.stringify(data, null, 2));
    } catch (error) {
        fs.writeFileSync("results.json", JSON.stringify({ error: error.message }, null, 2));
    }
}

listModels();
