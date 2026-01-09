import "dotenv/config";
console.log("Current Working Directory:", process.cwd());
console.log("Environment Variables Check:");
console.log("PORT:", process.env.PORT);
console.log("GEMINI_API_KEY loaded:", !!(process.env.GEMINI_API_KEY || process.env.GEMINI_API_SECRET));

import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

const PORT = process.env.PORT || 5000;

if (!process.env.COOKIE_SECRET) {
  throw new Error("COOKIE_SECRET is not defined in environment variables");
}

connectToDatabase()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Database Connection Error:", err.message);
  })
  .finally(() => {
    app.listen(PORT, () => console.log("Server running on Port", PORT));
  });