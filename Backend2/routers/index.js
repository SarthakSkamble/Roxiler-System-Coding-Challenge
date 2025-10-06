// backend/routes/index.js
import express from "express";
import system_administrator from "./System_Administrator.js"; // note the .js extension
import normaluser from "./normalusers.js"
const router = express.Router();

router.use("/system_administrator", system_administrator);
router.use("/normalusers", normaluser)

export default router;
