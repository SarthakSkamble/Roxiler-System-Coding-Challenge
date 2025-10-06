import express from "express";
import cors from "cors";
import router from "./routers/index.js"; // make sure the path is correct and includes .js
import dotenv from "dotenv";
const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1", router); // use the imported router

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
