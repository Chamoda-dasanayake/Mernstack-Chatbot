import "dotenv/config";
import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

const PORT = process.env.PORT || 5000;

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