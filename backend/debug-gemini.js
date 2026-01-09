
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_SECRET;

if (!apiKey) {
    console.error("No API Key found!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
    console.log(`\n--- Testing Model: ${modelName} ---`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello?");
        console.log(`SUCCESS`);
    } catch (error) {
        console.error(`FAILURE: ${modelName}`);
        console.error(error);
        if (error.response) {
            console.log(JSON.stringify(error.response, null, 2));
        }
    }
}

testModel("gemini-pro");
