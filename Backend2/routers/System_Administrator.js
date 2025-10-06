import express from "express";
import jwt from "jsonwebtoken";
import { Schema } from "../middleware/zodverification.js";
import bcrypt from "bcryptjs";
import { db } from "../db.js";  
import { Schema2 } from "../middleware/zodsigninverification.js";
import dotenv from "dotenv";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Schema3 } from "../middleware/storeaddzod.js";

dotenv.config();
const router = express.Router();

// POST /signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, address, password, role }=req.body
    const parsed = Schema.safeParse({ name, email, address, password, role });

    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    
    if (role !="system_admin")
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

    
    if (role !="system_admin")
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
      { email: user.email},
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

router.post("/newstores",authMiddleware, async(req,res)=>

{
    try{
    const {name,email,address,ownerId,password, role}=req.body
    const parsed = Schema.safeParse({name,address,email,password});
    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    
    const [result] = await db.execute(
      `INSERT INTO stores (owner_id, name, email, address) VALUES (?, ?, ?, ?)`,
      [ownerId, name, email || null, address]
    );
    
    
    

    

    
    
const hashedPassword = await bcrypt.hash(password, 10);
 const [result2] = await db.execute(
      `INSERT INTO users2 (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, address || null, role]
    );
    
    



    
    


    
    res.status(201).json({
      message: "Store created successfully",
      store: {
        store_id: result.insertId,
        owner_id: ownerId,
        name,
        email: email || null,
        address,
        avg_rating: 0.0
      }
    });
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }


    
})

router.post("/adduser",authMiddleware,async (req,res)=>
{
    try{
    const {name,address,email,password,role}=req.body
    const parsed = Schema.safeParse({name,address,email,password});
    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
 const [result2] = await db.execute(
      `INSERT INTO users2 (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, address || null, role]
    );
    res.status(201).json({
      message: "User created successfully",
      store: {
        store_id: result2.insertId,
        name,
        email: email || null,
        address,
        avg_rating: 0.0
      }
    });
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }


})

router.post("/addadmin",authMiddleware,async (req,res)=>
{
    try{
    const {name,address,email,password,role}=req.body
    const parsed = Schema.safeParse({name,address,email,password});
    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
 const [result2] = await db.execute(
      `INSERT INTO users2 (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, address || null, role]
    );
    res.status(201).json({
      message: "User created successfully",
      store: {
        store_id: result2.insertId,
        name,
        email: email || null,
        address,
        avg_rating: 0.0
      }
    });
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }


})

router.get("/bulkstores", authMiddleware, async (req, res) => {
  try {
    const filter = req.query.filter || "";

    // Query stores with optional filter on name or email
    const query = `
      SELECT name, email, address, avg_rating
      FROM stores
      WHERE name LIKE ? OR email LIKE ?
      ORDER BY created_at DESC
    `;
    const likeFilter = `%${filter}%`;
    const [rows] = await db.execute(query, [likeFilter, likeFilter]);

    res.status(200).json({
      message: "Stores fetched successfully",
      stores: rows,
    });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/bulkusers", authMiddleware, async (req, res) => {
  try {
    const filter = req.query.filter || "";

    // Query users with role normal_user or system_admin
    const query = `
      SELECT name, email, address, role
      FROM users2
      WHERE (role = 'normal_user' OR role = 'system_admin')
        AND (name LIKE ? OR email LIKE ?)
      ORDER BY created_at DESC
    `;
    const likeFilter = `%${filter}%`;
    const [rows] = await db.execute(query, [likeFilter, likeFilter]);

    res.status(200).json({
      message: "Users fetched successfully",
      users: rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
})

router.post("/logout", authMiddleware, async (req, res) => {
  try {
    // Since JWT is stateless, we just ask the client to discard the token
    // Optionally: we can add the token to a blacklist DB table for stricter security

    res.status(200).json({
      message: "Logout successful. Please remove the token from your client storage.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
export default router;
