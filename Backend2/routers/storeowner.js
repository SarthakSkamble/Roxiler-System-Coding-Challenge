import express from "express";
import jwt from "jsonwebtoken";
import { Schema } from "../middleware/zodverification.js";
import bcrypt from "bcryptjs";
import { db } from "../db.js";  
import { Schema2 } from "../middleware/zodsigninverification.js";
import dotenv from "dotenv";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

// POST /signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const parsed = Schema2.safeParse({ email,password});

    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    
    if (role !="store_owner")
    {
        return res.json({
            msg:"go back to main page"
        })
    }

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user by email and role
    const [rows] = await db.execute(
      `SELECT * FROM users2 WHERE email = ? AND role = ?`,
      [email, role]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.user_id,
        email: user.email,
        role: user.role,},
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.user_id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/updatepassword", authMiddleware, async (req, res) => {
  try {
    const { newpassword } = req.body;


    if (!newpassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;
    if (!passwordRegex.test(newpassword)) {
      return res.status(400).json({
        message:
          "Password must be 8–16 characters long, include at least one uppercase letter and one special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    
    const [result] = await db.execute(
      `UPDATE users2 SET password = ? WHERE email = ?`,
      [hashedPassword, req.email]  // req.email is set in authMiddleware
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    
    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});