import express from "express";
import jwt from "jsonwebtoken";
import { Schema } from "../middleware/zodverification.js";
import bcrypt from "bcryptjs";
import { db } from "../db.js";  
import { Schema2 } from "../middleware/zodsigninverification.js";
import dotenv from "dotenv";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, address, password, role }=req.body
    const parsed = Schema.safeParse({ name, email, address, password, role });

    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    
    if (role !="normal_user")
    {
        return res.json({
            msg:"go back to main page"
        })
    }

    
    const [existingUser] = await db.execute(`SELECT * FROM users WHERE email = ?`, [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const userRole = role || "normal_user";
    const [result] = await db.execute(
      `INSERT INTO users2 (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, address || null, userRole]
    );

    
    const token = jwt.sign(
      {email},
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: result.insertId, name, email, role: userRole },
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const parsed = Schema2.safeParse({ email,password});

    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    
    if (role !="normal_user")
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

router.get("/bulkstores", authMiddleware, async (req, res) => {
  try {
    // optional query param: ?filter=something
    const filter = req.query.filter ? `%${req.query.filter}%` : "%%";

    const [rows] = await db.execute(
      `SELECT name, email, address, avg_rating 
       FROM stores 
       WHERE name LIKE ? OR email LIKE ?`,
      [filter, filter]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No stores found" });
    }

    res.status(200).json({
      message: "Stores fetched successfully",
      stores: rows,
    });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Submit a rating for a store
router.post("/submitrating", authMiddleware, async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const email = req.email; // instead of req.user.user_id


    
    if (!store_id || !rating) {
      return res.status(400).json({ error: "store_id and rating are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    
    const [store] = await db.execute(`SELECT * FROM stores WHERE store_id = ?`, [store_id]);
    if (store.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }

    
    await db.execute(
      `INSERT INTO ratings4 (store_id, email, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP`,
      [store_id, email, rating]
    );

    res.status(200).json({ message: "Rating submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Logout route (client should delete token)
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    // Simply clear token on client side or mark it invalid (optional DB store for blacklisting)
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



export default router;